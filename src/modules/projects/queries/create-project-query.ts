import { createQuery } from '@/utils/signal/query/create-query'

import { createProject } from '../services/create-project'
import { Project } from '../types/project'

export const createProjectQuery = createQuery<
  Project,
  Parameters<typeof createProject>
>((params) => createProject(...params))
