import { createQuery } from '@/utils/signal/query/create-query'

import { namespaces } from '../services/namespaces'
import { Namespace } from '../types/namespace'

export const namespacesQuery = createQuery<Namespace[], undefined>(namespaces)
