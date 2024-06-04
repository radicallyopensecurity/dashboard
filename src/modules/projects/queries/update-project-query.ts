import { createQuery } from '@/utils/signal/query/create-query'

import { updateProject } from '../services/update-project'
import { Project } from '../types/project'

import { projectDetailsQuery } from './project-details.query'
import { groupProjects, projectsQuery } from './projects-query'

export const updateProjectQuery = createQuery<
  Project,
  Parameters<typeof updateProject>
>(
  (params) => {
    return updateProject(...params)
  },
  {
    after: async ([val], project) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const [projectId] = val as any
      const detailsPromise = projectDetailsQuery.fetch([projectId, 'network'])

      const all = projectsQuery.data?.all ?? []
      const filtered = all.filter((x) => x.id !== projectId)
      const newList = [...filtered, project]
      const grouped = groupProjects(newList)
      projectsQuery.set(grouped)

      await detailsPromise
    },
  }
)
