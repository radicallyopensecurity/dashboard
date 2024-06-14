import { createQuery } from '@/utils/signal/query/create-query'

import { createVariable } from '../services/create-variable'

import { projectDetailsQuery } from './project-details.query'

export const createVariableQuery = createQuery<
  void,
  Parameters<typeof createVariable>
>((params) => createVariable(...params), {
  after: async ([projectId]) => {
    await projectDetailsQuery.fetch([projectId, 'network'])
  },
})
