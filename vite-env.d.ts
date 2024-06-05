/// <reference types="vite/client" />
/// <reference types="vitest" />

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-var
  var pdfjsLib: any
}

interface ImportMetaEnv {
  readonly DEV_VITE_SERVER_CRT_PATH?: string
  readonly DEV_VITE_SERVER_KEY_PATH?: string
  readonly VITE_APP_URL: string
  readonly VITE_LOG_LEVEL?: string
  readonly VITE_GITLAB_CLIENT_ID: string
  readonly VITE_GITLAB_AUTHORITY: string
  readonly VITE_REPOSITORY_URL?: string
  readonly VITE_PUBLIC_ISSUE_TRACKER?: string
  readonly VITE_INTERNAL_ISSUE_TRACKER?: string
  readonly VITE_SECRET_GITLAB_TOKEN?: string
  readonly VITE_ROCKETCHAT_URL: string
  readonly VITE_CODIMD_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const __APP_VERSION__: string
declare const __APP_COMMIT__: string
