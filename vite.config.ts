import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import inject from '@rollup/plugin-inject';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    inject({
      // Polyfill Buffer in the browser
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  server: {
    host: true,
    port: 8100,
    watch: {
      usePolling: true,
    }
  },
  optimizeDeps: {
    include: ['bip39'],
    exclude: ['bip39/wordlists'],
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true
        }),
        NodeModulesPolyfillPlugin()
      ]
    }
  },
  build: {
    rollupOptions: {
      plugins: [
        inject({
          Buffer: ['buffer', 'Buffer'],
        })
      ],
      external: [
        /^bip39\/wordlists\/(?!english).*\.json$/
      ],
      output: {
        manualChunks(id) {
          if (/node_modules/.test(id)) {
            return 'vendor';
          }
          if (/.*\/wordlists\/(?!english).*\.json/.test(id)) {
            return 'bip39-wordlists';
          }
        }
      }
    }
  }
})
