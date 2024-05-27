import { OidcClient } from '@axa-fr/oidc-client'

import { isCallbackRoute } from '@/modules/auth/utils/is-callback-route'

import { createLogger } from '@/utils/logging/create-logger'

const logger = createLogger('ensure-auth')

export const ensureAuth =
  (client: OidcClient) =>
  async (redirectTo: string): Promise<boolean> => {
    logger.debug('checking auth')

    if (isCallbackRoute()) {
      logger.debug('is callback route, do nothing')
      return false
    }

    logger.debug('is not callback route, checking auth session')

    const sessionStatus = await client.tryKeepExistingSessionAsync()
    logger.debug(`session found: ${sessionStatus}`)

    if (!client.tokens) {
      logger.debug(`not authenticated, authenticating...`)
      await client.loginAsync(redirectTo)
      return false
    }

    logger.debug('is authenticated')
    return true
  }
