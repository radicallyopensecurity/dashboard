/// <reference types="vite/client" />
/// <reference types="vitest" />

interface ImportMetaEnv {
  readonly DEV_VITE_SERVER_CRT_PATH?: string
  readonly DEV_VITE_SERVER_KEY_PATH?: string
  readonly VITE_LOG_LEVEL?: string
  readonly VITE_GITLAB_CLIENT_ID: string
  readonly VITE_GITLAB_AUTHORITY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
