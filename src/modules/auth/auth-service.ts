import { ensureAuth } from './services/ensure-auth'

import { auth } from '@/modules/auth/auth-store'
import { authClient } from '@/modules/auth/client/auth-client'
import { loginCallback } from '@/modules/auth/services/login-callback'


export const authService = {
  ensureAuth: ensureAuth(authClient),
  loginCallback: loginCallback(authClient, auth),
}
