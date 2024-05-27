import { OidcClient } from '@axa-fr/oidc-client'

import { AuthStore } from '@/modules/auth/auth-store'
import { authClient } from '@/modules/auth/client/auth-client'

import { createLogger } from '@/utils/logging/create-logger'

const logger = createLogger('login-callback')

export const loginCallback =
  (client: OidcClient, authStore: AuthStore) => async () => {
    logger.debug('executing eyedp callback')
    const { callbackPath } = await client.loginCallbackAsync()

    if (!authClient.tokens) {
      logger.debug('callback unsuccessful. see development console')
      authStore.setAuthenticated(false)
      return
    }

    logger.debug('callback successful')
    authStore.setAuthenticated(true)
    // TODO: proper client side navigation
    window.location.href = callbackPath
  }
