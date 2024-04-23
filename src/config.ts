import { parseLogLevel } from '@/utils/logging/parse-log-level'
import { LogLevel } from '@/utils/logging/types'

import { ensureString } from './utils/string/ensure-string'

type Config = {
  app: {
    logLevel: LogLevel
  }
  oidc: {
    clientId: string
    authority: string
    redirectPath: string
    scope: string
  }
}

export const config: Config = {
  app: {
    logLevel: parseLogLevel(import.meta.env.VITE_LOG_LEVEL),
  },
  oidc: {
    clientId: ensureString(
      'VITE_GITLAB_CLIENT_ID',
      import.meta.env.VITE_GITLAB_CLIENT_ID
    ),
    authority: ensureString(
      'VITE_GITLAB_AUTHORITY',
      import.meta.env.VITE_GITLAB_AUTHORITY
    ),
    redirectPath: '/auth/callback',
    scope: 'openid profile email',
  },
}
