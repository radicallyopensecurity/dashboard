import { defineConfig, loadEnv } from 'vite'
import { readFileSync } from 'node:fs'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: '/',
    build: {
      sourcemap: true,
      assetsDir: 'dist',
      target: ['esnext'],
      cssMinify: false,
      minify: false,
      lib: false,
    },
    server: {
      host: 'ros-dashboard.test',
      port: 3443,
      https: {
        cert: readFileSync(
          env.DEV_VITE_SERVER_CRT_PATH || '.internal/certs/crt.pem'
        ),
        key: readFileSync(
          env.DEV_VITE_SERVER_KEY_PATH || '.internal/certs/key.pem'
        ),
      },
      headers: {
        'Content-Security-Policy': [
          // 'script-src self' prevents service worker unregister and token retrieval through iframes
          // SHOULD BE SET IN PRODUCTION
          // https://github.com/AxaFrance/oidc-client/blob/main/FAQ.md#good-security-practices--does-a-hacker-can-unregister-the-service-worker-and-retrieve-tokens-via-an-iframe-
          `script-src 'self'`,
          // worker-src blob: is needed for local development
          // SHOULD NOT BE SET IN PRODUCTION
          `worker-src 'self' blob:`,
        ].join(';'),
      },
    },
    plugins: [tsconfigPaths()],
  }
})
