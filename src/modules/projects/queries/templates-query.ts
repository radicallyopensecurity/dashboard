import { createQuery } from '@/utils/signal/query/create-query'

import { templates } from '../services/sync-templates'
import { Template } from '../types/template'

export const templatesQuery = createQuery<Template[], undefined>(templates)
