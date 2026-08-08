# Authentication (Phase 1)

Passwordless sign-in via a **6-digit emailed code**. No magic links, no
passwords. The server never calls Supabase to check a token.

## Why code-only

Magic links have two failure modes that hit business email far harder than
consumer email, and this product's audience is corporate finance and risk:

- **Link scanners consume them.** Proofpoint, Mimecast and Defender for O365
  pre-fetch URLs in inbound mail. A magic link is single-use, so the scanner can
  burn it before the recipient clicks — they see "link already used" on the
  first attempt.
- **PKCE requires the same browser.** The code verifier lives in `localStorage`
  of the browser that requested the link. Outlook's embedded browser breaks it.

A code the user types into the tab they already have open is immune to both.

## Flow

```
/login  ─ signInWithOtp({ shouldCreateUser: true }) ─►  Supabase emails a code
                                                          │
        user types the code ─ verifyOtp({ type: 'email' })┘
                             │
                             ▼
/pro    ─ RequireAuth sees a session and renders
          ProPage calls /api/me with `Authorization: Bearer <jwt>`
                             │
                             ▼
api/_lib/auth.ts ─ verifies ES256 signature against the cached JWKS
```

Token verification is **local**. The project publishes its public key at
`/auth/v1/.well-known/jwks.json`; `jose` fetches it once and caches it. No
per-request round trip to Supabase, no secret key involved.

`RequireAuth` is UX only. It decides what to render, never what a user may
access — anyone can edit the bundle. Real gating happens in `/api`.

## Required Supabase configuration

**1. `{{ .Token }}` in BOTH email templates.** Supabase picks the template by
account state:

| Template | Sent to |
|---|---|
| **Magic Link** | an existing user signing in |
| **Confirm signup** | a brand-new address (`shouldCreateUser: true`) |

If only one contains `{{ .Token }}`, that half of your users gets an unusable
email. Since new PRO subscribers are by definition new addresses, **Confirm
signup is the one that matters most at launch.**

**2. Code length must match `VITE_AUTH_CODE_LENGTH`.** Supabase's email OTP
length is configurable from 6 to 10 digits at Authentication → Email settings
(`GOTRUE_MAILER_OTP_LENGTH`); hosted projects default to **8**, not 6.

If the app's value is shorter than Supabase's, the input silently truncates what
the user types and **no code can ever verify** — with no error explaining why.
`VITE_AUTH_CODE_LENGTH` defaults to 8 and clamps to 6–10.

**3. Custom SMTP** — already pointed at Brevo. The built-in sender is rate
limited to a handful of emails per hour; since the code *is* the login, that
would be a hard outage rather than a degradation.

**4. Redirect URLs** — no longer needed. Nothing in this flow uses a callback
URL, and `detectSessionInUrl` is off.

## Resend rate limit

Supabase allows one OTP request per address per **60 seconds**. The "Send a new
code" button therefore counts down and stays disabled until the window passes,
rather than letting the user trigger a rejection. Codes expire after 1 hour.

## Required Vercel configuration

`VITE_`-prefixed variables are inlined at **build** time, not read at runtime.
They must exist in the Vercel project before the build runs, or the deployed
bundle ships `undefined` and the app throws on load:

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Server-only variables (`SUPABASE_SERVICE_ROLE_KEY`, `BREVO_API_KEY`, …) are read
at request time and can change without a rebuild.

## Local development

```bash
npm run dev       # Vite only — /api routes are NOT served
npm run dev:api   # vercel dev — serves the SPA and /api together
```

Use `npm run dev:api` for anything touching auth, since `/api/me` is how the
session gets verified.

## Deployment constraint: `.js` import specifiers

**Every relative import under `api/` must be written with a `.js` extension**,
even though the file on disk is `.ts`:

```ts
import { json } from './_lib/http.js';   // ✅ resolves after compilation
import { json } from './_lib/http.ts';   // ❌ ERR_MODULE_NOT_FOUND in production
import { json } from './_lib/http';      // ❌ Node ESM needs an extension
```

Vercel compiles `api/*.ts` to `api/*.js` but does **not** rewrite import
specifiers, so a `.ts` specifier becomes a runtime lookup for a file that does
not exist in the bundle. It type-checks, it passes Vitest (Vite resolves `.ts`
happily), and then every function returns `FUNCTION_INVOCATION_FAILED`.

`tests/api/import-specifiers.test.ts` enforces this statically and instantly.

## Tests

| File | Covers |
|---|---|
| `tests/api/auth.test.ts` | JWT verification: valid, expired, wrong issuer/audience, forged signature, missing subject, HS256 algorithm confusion, `alg: none`, JWKS caching |
| `tests/api/me.test.ts` | `/api/me` status codes, and that rejection reasons never leak to the client |
| `tests/api/import-specifiers.test.ts` | The `.js` specifier rule above |
| `tests/api/build-output.test.ts` | Loads the **compiled** functions from `.vercel/output` — skipped unless a build exists |
| `tests/ui/RequireAuth.test.tsx` | Loading state, redirect, sign-out propagation, subscription cleanup |
| `tests/ui/LoginPage.test.tsx` | Request, verify, resend, digit filtering, generic error copy |

```bash
npm test                        # fast suite; build-output test skips
npx vercel build && npm test    # full fidelity, catches deploy-only breakage
```

Run the full-fidelity form before any deploy. The fast suite alone cannot see
packaging failures — that gap is exactly what shipped the `.ts` specifier bug.
