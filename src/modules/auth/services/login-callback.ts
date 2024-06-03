import { authClient } from '@/modules/auth/client/auth-client'

import { createLogger } from '@/utils/logging/create-logger'

const logger = createLogger('login-callback')

export const loginCallback = async (): Promise<false | string> => {
  logger.debug('executing oidc callback')
  const { callbackPath } = await authClient.loginCallbackAsync()

  if (!authClient.tokens) {
    logger.debug('callback unsuccessful. see development console')
    return false
  }

  logger.debug('callback successful')
  return callbackPath
}
