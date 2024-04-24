import { authClient } from '@/auth/auth-client'
import { isCallbackRoute } from '@/auth/is-callback-route'

import { createLogger } from '@/utils/logging/create-logger'

const logger = createLogger('ensure-auth')

export const ensureAuth = async (redirectTo: string): Promise<boolean> => {
  logger.info('checking auth')

  if (isCallbackRoute()) {
    logger.info('is callback route, do nothing')
    return false
  }

  logger.info('is not callback route, checking auth session')

  const sessionStatus = await authClient.tryKeepExistingSessionAsync()
  logger.info(`session found: ${sessionStatus}`)

  if (!authClient.tokens) {
    logger.info(`not authenticated, authenticating...`)
    await authClient.loginAsync(redirectTo)
    return false
  }

  logger.info('is authenticated')
  return true
}
