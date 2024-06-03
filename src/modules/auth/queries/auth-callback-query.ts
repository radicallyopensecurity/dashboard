import { loginCallback } from '@/modules/auth/services/login-callback'

import { createQuery } from '@/utils/signal/query/create-query'

export const authCallbackQuery = createQuery(loginCallback)
