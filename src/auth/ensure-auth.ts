import { OidcUserInfo } from '@axa-fr/oidc-client'
import { createLogger } from '@/utils/logging/create-logger'
import { isCallbackRoute } from '@/auth/is-callback-route'
import { authClient } from './auth-client'

const logger = createLogger('ensure-auth')

export const ensureAuth = async (
  redirectTo: string
): Promise<void | OidcUserInfo> => {
  logger.debug('checking auth')

  if (isCallbackRoute()) {
    logger.debug('is callback route, do nothing')
    return
  }

  logger.debug('is not callback route, checking auth session')

  const sessionStatus = await authClient.tryKeepExistingSessionAsync()
  logger.debug(`session found: ${sessionStatus}`)

  if (authClient.tokens) {
    logger.debug('authentication good, getting userinfo')
    const userInfo = await authClient.userInfoAsync()
    return userInfo
  }

  logger.debug(`not authenticated, authenticating...`)
  authClient.loginAsync(redirectTo)
}
