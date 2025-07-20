/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const chname = id.toString().split('node_modules/')[1].split('/')[0].toString();
            if (chname.includes('react') || chname.includes('scheduler')) {
              return 'react';
            }
            return chname;
          }
        },
      },
    },
  },
});
