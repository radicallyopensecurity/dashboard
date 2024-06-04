import { createQuery } from '@/utils/signal/query/create-query'

import { ProjectsData } from '../normalizers/normalize-project'
import { projects } from '../services/projects'

export const projectsQuery = createQuery<ProjectsData>(projects)
