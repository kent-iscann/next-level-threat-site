import { defineConfig } from 'vitest/config';

// Separate from vite.config.ts so the React plugin does not load for node tests.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    coverage: {
      provider: 'v8',
      include: ['api/**/*.ts'],
    },
  },
});
