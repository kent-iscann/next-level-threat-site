/**
 * GET /api/me — returns the authenticated caller.
 *
 * Proves the browser → JWT → server verification chain end to end. From Phase 3
 * this is where subscription tier joins the response, making it the single
 * endpoint the PRO UI asks "who am I and what can I see?".
 */
import { json, jsonError } from './_lib/http.ts';
import { requireUser, UnauthorizedError } from './_lib/auth.ts';

export async function GET(request: Request): Promise<Response> {
  try {
    const user = await requireUser(request);
    return json({
      id: user.id,
      email: user.email,
      // Placeholders until Phase 3 mirrors Stripe state into Supabase.
      tier: 0,
      status: 'none',
    });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      console.warn('[me] rejected:', err.reason);
      return jsonError('Unauthorized', 401);
    }
    console.error('[me] unexpected error:', err);
    return jsonError('Server error', 500);
  }
}
