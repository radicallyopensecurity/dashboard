import { parseLogLevel } from '@/utils/logging/parse-log-level'
import { LogLevel } from '@/utils/logging/types'
import { ensureString } from '@/utils/string/ensure-string'

import {
  CODIMD_SUBMDOMAIN,
  DASHBOARD_SUBDOMAIN,
  GITLAB_SUBDOMAIN,
  ROCKET_CHAT_SUBDOMAIN,
} from '@/constants'

type Config = {
  app: {
    logLevel: LogLevel
    gitlabBaseUrl: string
    url: string
  }
  services: {
    rocketChatUrl: string
    gitlabUrl: string
    codiMdUrl: string
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

const appUrl = ensureString('VITE_APP_URL', import.meta.env.VITE_APP_URL)

export const config: Config = {
  app: {
    logLevel: parseLogLevel(import.meta.env.VITE_LOG_LEVEL),
    gitlabBaseUrl: `${gitlabAuthority}/api/v4`,
    url: appUrl,
  },
  services: {
    rocketChatUrl: appUrl.replace(DASHBOARD_SUBDOMAIN, ROCKET_CHAT_SUBDOMAIN),
    gitlabUrl: appUrl.replace(DASHBOARD_SUBDOMAIN, GITLAB_SUBDOMAIN),
    codiMdUrl: appUrl.replace(DASHBOARD_SUBDOMAIN, CODIMD_SUBMDOMAIN),
  },
  oidc: {
    clientId: ensureString(
      'VITE_GITLAB_CLIENT_ID',
      import.meta.env.VITE_GITLAB_CLIENT_ID
    ),
    authority: gitlabAuthority,
    redirectPath: '/auth/callback',
    scope: 'openid profile read_user read_api',
  },
}
