import { CreateGitLabVariable } from '@/modules/gitlab/client/functions/create-variable'
import { GitLabService } from '@/modules/gitlab/gitlab-service'

import { createLogger } from '@/utils/logging/create-logger'

import { ProjectDetailsStore } from '../project-details-store'

import { syncProjectDetails } from './sync-project-details'

const logger = createLogger('create-variable')

export const createVariable =
  (service: GitLabService, detailsStore: ProjectDetailsStore) =>
  async (id: number, payload: CreateGitLabVariable, token: string) => {
    logger.debug('creating...')
    detailsStore.setIsLoading(id, true)
    await service.createVariable(id, payload, token)
    await Promise.all([
      syncProjectDetails(service, detailsStore)(id, 'network'),
    ])
    detailsStore.setIsLoading(id, false)
  }
