import { isDefined } from '@/utils/object/is-defined'
import { createQuery } from '@/utils/signal/query/create-query'

import { syncProjectDetails } from '../services/sync-project-details'
import { ProjectDetails } from '../types/project-details'

type ProjectDetailsQueryResult = Record<
  number,
  { isLoading: boolean; data: ProjectDetails | null }
>

export const projectDetailsQuery = createQuery<
  ProjectDetailsQueryResult,
  Parameters<typeof syncProjectDetails>,
  ProjectDetails
>(([id, mode]) => syncProjectDetails(id, mode), {
  before: (cache, [param], setValue) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const [projectId, mode] = param as any
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const fromCache = cache?.[projectId]
    if (mode === 'cache' && isDefined(fromCache)) {
      return fromCache
    }

    const update: ProjectDetailsQueryResult = {
      [projectId]: {
        isLoading: true,
        data: fromCache?.data ?? null,
      },
    }

    setValue(update)
    return update
  },
  transform: (details, current) => {
    return {
      ...current,
      [details.id]: {
        isLoading: false,
        data: details,
      },
    }
  },
})
