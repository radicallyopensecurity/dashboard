import { createQuery } from '@/utils/signal/query/create-query'

import { namespaces } from '../services/sync-namespaces'
import { Namespace } from '../types/namespace'

export const namespacesQuery = createQuery<Namespace[], undefined>(namespaces)
