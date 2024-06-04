import { gitlabClient } from '@/api/gitlab/gitlab-client'
import { fetchPaginated } from '@/api/gitlab/utils/fetch-paginated'

import { IGNORED_NAMESPACES_MAP } from '@/modules/projects/constants/namespaces'
import {
  groupProjects,
  normalizeProject,
} from '@/modules/projects/normalizers/normalize-project'

import { createLogger } from '@/utils/logging/create-logger'

const logger = createLogger('sync-projects')

export const projects = async () => {
  logger.debug('syncing...')
  const result = await fetchPaginated(gitlabClient.projects)
  const normalized = result
    .filter((x) => !IGNORED_NAMESPACES_MAP[x.namespace.path])
    .map(normalizeProject)
  const grouped = groupProjects(normalized)
  logger.debug('data', grouped)
  return grouped
}
