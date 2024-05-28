import { normalizeProject } from '@/modules/projects/normalizers/normalize-project'
import { type ProjectsStore } from '@/modules/projects/projects-store'

import { createLogger } from '@/utils/logging/create-logger'

import { type GitLabService } from '@/api/gitlab/gitlab-service'

const logger = createLogger('sync-projects')

export const syncProjects =
  (service: GitLabService, store: ProjectsStore) => async () => {
    logger.debug('syncing...')
    store.setIsLoading(true)
    const result = await service.projects()
    const normalized = result.map(normalizeProject)
    logger.debug('data', normalized)
    store.set(normalized)
    store.setIsLoading(false)
  }
