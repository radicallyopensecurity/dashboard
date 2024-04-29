import { OidcClient } from '@axa-fr/oidc-client'

import { isCallbackRoute } from '@/modules/auth/utils/is-callback-route'

import { createLogger } from '@/utils/logging/create-logger'



const logger = createLogger('ensure-auth')

export const ensureAuth =
  (client: OidcClient) =>
  async (redirectTo: string): Promise<boolean> => {
    logger.info('checking auth')

    if (isCallbackRoute()) {
      logger.info('is callback route, do nothing')
      return false
    }

    logger.info('is not callback route, checking auth session')

    const sessionStatus = await client.tryKeepExistingSessionAsync()
    logger.info(`session found: ${sessionStatus}`)

    if (!client.tokens) {
      logger.info(`not authenticated, authenticating...`)
      await client.loginAsync(redirectTo)
      return false
    }

    logger.info('is authenticated')
    return true
  }
