import { auth } from '@/modules/auth/auth-signal'
import { ensureAuth } from '@/modules/auth/services/ensure-auth'
import { loginCallback } from '@/modules/auth/services/login-callback'

export const authService = {
  ensureAuth: async (redirectTo?: string): Promise<boolean> => {
    auth.setLoading(true)
    const result = await ensureAuth(redirectTo)
    auth.setAuthenticated(result)
    return result
  },
  loginCallback: async (): Promise<false | string> => {
    auth.setLoading(true)
    const result = await loginCallback()
    auth.setAuthenticated(Boolean(result))
    return result
  },
}
