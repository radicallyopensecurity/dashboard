import { OidcUserInfo } from '@axa-fr/oidc-client'

import { isCallbackRoute } from '@/auth/is-callback-route'

import { createLogger } from '@/utils/logging/create-logger'

import { authClient } from './auth-client'

const logger = createLogger('ensure-auth')

export const ensureAuth = async (
  redirectTo: string
): Promise<void | OidcUserInfo> => {
  logger.info('checking auth')

  if (isCallbackRoute()) {
    logger.info('is callback route, do nothing')
    return
  }

  logger.info('is not callback route, checking auth session')

  const sessionStatus = await authClient.tryKeepExistingSessionAsync()
  logger.info(`session found: ${sessionStatus}`)

  if (authClient.tokens) {
    logger.info('authentication good, getting userinfo')
    const userInfo = await authClient.userInfoAsync()
    return userInfo
  }

  logger.info(`not authenticated, authenticating...`)
  await authClient.loginAsync(redirectTo)
}
