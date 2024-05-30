import { type GitLabClient } from '@/api/gitlab/gitlab-client'
import { fetchPaginated } from '@/api/gitlab/utils/fetch-paginated'

import { normalizeProject } from '@/modules/projects/normalizers/normalize-project'
import { type ProjectsStore } from '@/modules/projects/store/projects-store'

import { createLogger } from '@/utils/logging/create-logger'

const logger = createLogger('sync-projects')

export const syncProjects =
  (client: GitLabClient, store: ProjectsStore) => async () => {
    logger.debug('syncing...')
    store.setIsLoading(true)
    const result = await fetchPaginated(client.projects)
    const normalized = result.map(normalizeProject)
    logger.debug('data', normalized)
    store.set(normalized)
    store.setIsLoading(false)
  }
