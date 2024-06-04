import { createQuery } from '@/utils/signal/query/create-query'

import { projectFinding } from '../services/project-finding'
import { ProjectFindingDetails } from '../types/project-findings'
import { projectFindingKey } from '../utils/project-finding-key'

type ProjectFindingsQueryData = Record<
  string,
  { isLoading: boolean; data: ProjectFindingDetails | null }
>

export const projectFindingsQuery = createQuery<
  ProjectFindingsQueryData,
  Parameters<typeof projectFinding>,
  ProjectFindingDetails
>(
  ([projectId, issueId]) => {
    return projectFinding(projectId, issueId)
  },
  {
    before: (cache, [projectId, issueId], setValue) => {
      const key = projectFindingKey(projectId, issueId)
      const fromCache = cache?.[key]
      if (cache && fromCache?.isLoading) {
        return cache
      }

      const update: ProjectFindingsQueryData = {
        [key]: {
          isLoading: true,
          data: null,
        },
      }

      setValue(update)
      return update
    },
    transform: (details, current) => {
      const key = projectFindingKey(details.projectId, details.issueId)
      const value = current?.[key]
      return {
        ...current,
        [key]: {
          isLoading: value?.isLoading ?? false,
          data: details,
        },
      }
    },
  }
)
