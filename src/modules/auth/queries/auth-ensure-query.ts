import { ensureAuth } from '@/modules/auth/services/ensure-auth'

import { createQuery } from '@/utils/signal/query/create-query'

export const authEnsureQuery = createQuery(ensureAuth)
