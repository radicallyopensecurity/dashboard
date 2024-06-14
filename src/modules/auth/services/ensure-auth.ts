import { authClient } from '@/modules/auth/client/auth-client'
import { isCallbackRoute } from '@/modules/auth/utils/is-callback-route'

import { createLogger } from '@/utils/logging/create-logger'

const logger = createLogger('ensure-auth')

export const ensureAuth = async (
  redirectTo: string = window.location.pathname
): Promise<boolean> => {
  logger.debug('checking auth')

  if (isCallbackRoute()) {
    logger.debug('is callback route, do nothing')
    return false
  }

  logger.debug('is not callback route, checking auth session')

  const sessionStatus = await authClient.tryKeepExistingSessionAsync()
  logger.debug(`session found: ${sessionStatus}`)

  if (!authClient.tokens) {
    logger.debug(`not authenticated, authenticating...`)
    await authClient.loginAsync(redirectTo)
    return false
  }

  logger.debug('is authenticated')
  return true
}
