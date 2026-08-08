import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// The Supabase browser client throws at import time when env vars are absent,
// and every component under test reaches it transitively.
vi.stubEnv('VITE_SUPABASE_URL', 'https://test-project.supabase.co');
vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'sb_publishable_test');

afterEach(() => {
  cleanup();
});
