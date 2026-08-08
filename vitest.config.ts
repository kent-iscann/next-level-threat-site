import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  test: {
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    coverage: {
      provider: 'v8',
      include: ['api/**/*.ts', 'src/auth/**/*.tsx', 'src/config.ts'],
    },
    projects: [
      {
        // Server code and pure modules — no DOM, no React plugin.
        test: {
          name: 'server',
          environment: 'node',
          include: ['tests/api/**/*.test.ts', 'tests/lib/**/*.test.ts'],
        },
      },
      {
        plugins: [react()],
        test: {
          name: 'ui',
          environment: 'jsdom',
          include: ['tests/ui/**/*.test.tsx'],
          setupFiles: ['tests/ui/setup.ts'],
        },
      },
    ],
  },
});
