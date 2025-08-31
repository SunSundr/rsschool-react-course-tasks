/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    clearMocks: true,
    setupFiles: ['src/__tests__/setup.ts'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/index.tsx',
        'src/App.tsx',
        'src/Main.tsx',
        'src/types.ts',
        'src/__tests__/**/*.*',
        'src/**/*.d.ts',
      ],
      all: true,
      thresholds: {
        global: {
          statements: 80,
          branches: 50,
          functions: 50,
          lines: 50,
        },
      },
    },
  },
});
