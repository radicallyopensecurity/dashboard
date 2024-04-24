import { readFileSync } from 'node:fs'

import { defineConfig, loadEnv } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import tsconfigPaths from 'vite-tsconfig-paths'

const iconsPath = 'node_modules/@shoelace-style/shoelace/dist/assets/icons'

const PORT = 3443

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: '/',
    resolve: {
      alias: [
        {
          find: /\/assets\/icons\/(.+)/,
          replacement: `${iconsPath}/$1`,
        },
      ],
    },
    build: {
      sourcemap: true,
      assetsDir: 'dist',
      target: ['esnext'],
      cssMinify: false,
      minify: false,
      lib: false,
    },
    preview: {
      port: PORT,
    },
    server: {
      host: 'ros-dashboard.test',
      port: PORT,
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
    plugins: [
      tsconfigPaths(),
      viteStaticCopy({
        targets: [
          {
            src: iconsPath,
            dest: 'assets',
          },
        ],
      }),
    ],
  }
})
