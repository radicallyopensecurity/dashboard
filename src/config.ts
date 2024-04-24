import { parseLogLevel } from '@/utils/logging/parse-log-level'
import { LogLevel } from '@/utils/logging/types'

import { ensureString } from './utils/string/ensure-string'

type Config = {
  app: {
    logLevel: LogLevel
    gitlabBaseUrl: string
  }
  oidc: {
    clientId: string
    authority: string
    redirectPath: string
    scope: string
  }
}

const gitlabAuthority = ensureString(
  'VITE_GITLAB_AUTHORITY',
  import.meta.env.VITE_GITLAB_AUTHORITY
)

export const config: Config = {
  app: {
    logLevel: parseLogLevel(import.meta.env.VITE_LOG_LEVEL),
    gitlabBaseUrl: `${gitlabAuthority}/api/v4`,
  },
  oidc: {
    clientId: ensureString(
      'VITE_GITLAB_CLIENT_ID',
      import.meta.env.VITE_GITLAB_CLIENT_ID
    ),
    authority: gitlabAuthority,
    redirectPath: '/auth/callback',
    scope: 'openid profile email read_user read_api',
  },
}
