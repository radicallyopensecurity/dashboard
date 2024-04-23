import { requiredEnvVariable } from './utils/environment'

type Config = {
  oidc: {
    clientId: string
    authority: string
    redirectPath: string
    scope: string
  }
}

export const config: Config = {
  oidc: {
    clientId: requiredEnvVariable('VITE_GITLAB_CLIENT_ID'),
    authority: requiredEnvVariable('VITE_GITLAB_AUTHORITY'),
    redirectPath: '/auth/callback',
    scope: 'openid profile email',
  },
}
