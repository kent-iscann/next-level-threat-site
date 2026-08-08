import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

/**
 * Client-side route guard.
 *
 * This is UX only — it decides what to render, never what a user may access.
 * Anyone can edit the bundle. Every protected resource is gated again server
 * side in /api before any private content is signed for or returned.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container auth-pending" role="status" aria-live="polite">
        <p>Checking your session…</p>
      </div>
    );
  }

  if (!session) {
    // `from` lets the login page send the user back where they were headed.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
