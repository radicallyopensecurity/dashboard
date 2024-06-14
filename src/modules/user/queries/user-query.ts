import { createQuery } from '@/utils/signal/query/create-query'

import { getUser } from '../services/sync-user'
import { User } from '../types/user'

export const userQuery = createQuery<User, undefined>(getUser)
