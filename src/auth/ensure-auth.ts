import { isCallbackRoute } from '@/auth/is-callback-route'

import { createLogger } from '@/utils/logging/create-logger'

import { user } from '@/state/user'

import { authClient } from './auth-client'

const logger = createLogger('ensure-auth')

export const ensureAuth = async (redirectTo: string): Promise<void> => {
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

    logger.info('setting userinfo')
    logger.debug('userInfo response', userInfo)

    user.setFromUserInfo(userInfo)
    return
  }

  logger.info(`not authenticated, authenticating...`)
  await authClient.loginAsync(redirectTo)
}
