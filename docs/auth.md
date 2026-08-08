# Authentication (Phase 1)

Magic-link auth via Supabase. No passwords are stored, and the server never
calls Supabase to check a token.

## Flow

```
/login  ─ signInWithOtp ─►  Supabase sends email
                             │
   user clicks link ─────────┘
                             ▼
/auth/callback  ─ supabase-js exchanges ?code= for a session (PKCE)
                             │
                             ▼
/pro            ─ RequireAuth sees a session and renders
                  ProPage calls /api/me with `Authorization: Bearer <jwt>`
                             │
                             ▼
api/_lib/auth.ts ─ verifies ES256 signature against the cached JWKS
```

Token verification is **local**. The project publishes its public key at
`/auth/v1/.well-known/jwks.json`; `jose` fetches it once and caches it. There is
no per-request round trip to Supabase and no secret key involved.

`RequireAuth` is UX only. It decides what to render, never what a user may
access — anyone can edit the bundle. Real gating happens in `/api`.

## Required Supabase dashboard configuration

**1. Redirect URL allowlist** — Authentication → URL Configuration. Magic links
silently fail without this; it is the most common setup mistake.

```
Site URL:       https://signal-and-fracture.vercel.app
Redirect URLs:  https://signal-and-fracture.vercel.app/auth/callback
                http://localhost:5173/auth/callback
                http://localhost:3000/auth/callback
                https://*-<your-team>.vercel.app/auth/callback   ← preview deploys
```

**2. Custom SMTP** — already pointed at Brevo. The built-in sender is rate
limited to a handful of emails per hour and is not usable in production; since
magic link *is* the login, that would be a hard outage rather than a degradation.

**3. Email template** — only needed to enable the OTP code fallback, below.

## Required Vercel configuration

`VITE_`-prefixed variables are inlined at **build** time, not read at runtime.
They must exist in the Vercel project's environment variables *before* the build
runs, or the deployed bundle ships with `undefined` and the app throws on load:

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Server-only variables (`SUPABASE_SERVICE_ROLE_KEY`, `BREVO_API_KEY`, …) are read
at request time and can be changed without rebuilding.

## The corporate-inbox problem

Magic links have two failure modes that hit business email harder than consumer
email, and this product's audience is corporate finance and risk:

**Link scanners consume the link.** Proofpoint, Mimecast and Defender for O365
pre-fetch URLs in inbound mail to check them. A magic link is single-use, so the
scanner can burn it before the recipient clicks. The user sees "link already
used" on their first attempt.

**PKCE requires the same browser.** The code verifier lives in `localStorage` of
the browser that requested the link. If the link opens in Outlook's embedded
browser rather than the user's default, the exchange fails.
`AuthCallbackPage` detects this and explains it rather than showing a raw error.

The fix for both is a **6-digit code** the user types into the page they already
have open. It is immune to scanners and browser mismatch.

### Enabling the OTP code fallback

It is built and tested but **off by default**, because it needs a template change
first — showing a code box that no email contains would be worse than not
offering one.

1. Supabase → Authentication → Email Templates → Magic Link. Add the token
   alongside the existing link:

   ```html
   <p>Or enter this code: <strong>{{ .Token }}</strong></p>
   ```

2. Set `VITE_AUTH_OTP_ENABLED=true` in Vercel and redeploy.

The login page then offers code entry beside the link on the "check your email"
screen.

## Local development

```bash
npm run dev       # Vite only — /api routes are NOT served
npm run dev:api   # vercel dev — serves the SPA and /api together
```

Use `npm run dev:api` for anything touching auth, since `/api/me` is how the
session gets verified. Add `http://localhost:3000/auth/callback` to the Supabase
redirect allowlist (`vercel dev` defaults to port 3000).

## Tests

| File | Covers |
|---|---|
| `tests/api/auth.test.ts` | JWT verification: valid, expired, wrong issuer/audience, forged signature, missing subject, HS256 algorithm confusion, `alg: none`, JWKS caching |
| `tests/api/me.test.ts` | `/api/me` status codes, and that rejection reasons are never leaked to the client |
| `tests/ui/RequireAuth.test.tsx` | Loading state, redirect, sign-out propagation, subscription cleanup |
| `tests/ui/LoginPage.test.tsx` | Send flow, redirect target, error surfacing, OTP flag on/off |
| `tests/api/module-load.test.ts` | Every `/api` module loads under Node's strip-only type removal |

That last one exists because a TypeScript parameter property in `_lib/env.ts`
type-checked cleanly, passed all 72 unit tests, and took down both production
functions with `FUNCTION_INVOCATION_FAILED`. Vitest imports through Vite, which
fully transpiles TypeScript; Vercel only *strips* types. Anything needing code
generation — parameter properties, enums, decorators, namespaces — must not
appear under `api/`.
