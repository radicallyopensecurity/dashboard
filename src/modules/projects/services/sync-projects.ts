import { createLogger } from '@/utils/logging/create-logger'

import { type GitlabClient } from '@/modules/gitlab/gitlab-client'
import { normalizeProject } from '@/modules/projects/normalizers/normalize-project'
import { type ProjectsStore } from '@/modules/projects/projects-store'


const logger = createLogger('sync-projects')

export const syncProjects =
  (client: GitlabClient, store: ProjectsStore) => async () => {
    logger.info('syncing...')
    store.setIsLoading(true)
    const result = await client.allProjects()
    const normalized = result.map(normalizeProject)
    store.set(normalized)
    store.setIsLoading(false)
  }
