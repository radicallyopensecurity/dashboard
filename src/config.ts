import { parseLogLevel } from '@/utils/logging/parse-log-level'
import { LogLevel } from '@/utils/logging/types'
import { ensureString } from '@/utils/string/ensure-string'

type Config = {
  app: {
    logLevel: LogLevel
    gitlabBaseUrl: string
    url: string
    version: string
    commit: string
    publicReportIssueUrl?: string
    internalReportIssueUrl?: string
    repositoryUrl?: string
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
    version: __APP_VERSION__,
    commit: __APP_COMMIT__,
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    repositoryUrl: import.meta.env.VITE_REPOSITORY_URL || undefined,
    publicReportIssueUrl:
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      import.meta.env.VITE_PUBLIC_ISSUE_TRACKER || undefined,
    internalReportIssueUrl:
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      import.meta.env.VITE_INTERNAL_ISSUE_TRACKER || undefined,
  },
  services: {
    rocketChatUrl: ensureString(
      'VITE_ROCKETCHAT_URL',
      import.meta.env.VITE_ROCKETCHAT_URL
    ),
    codiMdUrl: ensureString('VITE_CODIMD_URL', import.meta.env.VITE_CODIMD_URL),
    gitlabUrl: gitlabAuthority,
  },
  oidc: {
    clientId: ensureString(
      'VITE_GITLAB_CLIENT_ID',
      import.meta.env.VITE_GITLAB_CLIENT_ID
    ),
    authority: gitlabAuthority,
    redirectPath: '/auth/callback',
    scope: 'openid profile api',
  },
}
