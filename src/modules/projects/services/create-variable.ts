import { CreateGitLabVariable } from '@/api/gitlab/client/create-variable'
import { GitLabClient } from '@/api/gitlab/gitlab-client'

import { createLogger } from '@/utils/logging/create-logger'

import { ProjectDetailsStore } from '../store/project-details-store'

import { syncProjectDetails } from './sync-project-details'

const logger = createLogger('create-variable')

export const createVariable =
  (client: GitLabClient, detailsStore: ProjectDetailsStore) =>
  async (id: number, payload: CreateGitLabVariable) => {
    logger.debug('creating...')
    detailsStore.setIsLoading(id, true)
    await client.createVariable(id, payload)
    await Promise.all([syncProjectDetails(client, detailsStore)(id, 'network')])
    detailsStore.setIsLoading(id, false)
  }
