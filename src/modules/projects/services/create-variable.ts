import { createLogger } from '@/utils/logging/create-logger'

import { ProjectDetailsStore } from '../project-details-store'

import { syncProjectDetails } from './sync-project-details'

import { CreateGitLabVariable } from '@/api/gitlab/client/functions/create-variable'
import { GitLabService } from '@/api/gitlab/gitlab-service'

const logger = createLogger('create-variable')

export const createVariable =
  (service: GitLabService, detailsStore: ProjectDetailsStore) =>
  async (id: number, payload: CreateGitLabVariable) => {
    logger.debug('creating...')
    detailsStore.setIsLoading(id, true)
    await service.createVariable(id, payload)
    await Promise.all([
      syncProjectDetails(service, detailsStore)(id, 'network'),
    ])
    detailsStore.setIsLoading(id, false)
  }
