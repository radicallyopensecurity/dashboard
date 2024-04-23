import { requiredEnvVariable } from '@/utils/environment/required-env-var'
import { parseLogLevel } from '@/utils/logging/parse-log-level'
import { LogLevel } from '@/utils/logging/types'

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
    clientId: requiredEnvVariable(import.meta.env.VITE_GITLAB_CLIENT_ID),
    authority: requiredEnvVariable(import.meta.env.VITE_GITLAB_AUTHORITY),
    redirectPath: '/auth/callback',
    scope: 'openid profile email',
  },
}
