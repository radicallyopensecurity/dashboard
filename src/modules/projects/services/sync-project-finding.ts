import { gitlabClient } from '@/api/gitlab/gitlab-client'
import { fetchPaginated } from '@/api/gitlab/utils/fetch-paginated'

import { createLogger } from '@/utils/logging/create-logger'
import { isDefined } from '@/utils/object/is-defined'

import { normalizeProjectFinding } from '../normalizers/normalize-project-finding'
import { projectFindingsQuery } from '../queries/project-finding-query'
import { ProjectFindingDetails } from '../types/project-findings'
import { projectFindingKey } from '../utils/project-finding-key'

const logger = createLogger('sync-project-discussion')

export const syncProjectFinding = async (
  projectId: number,
  issueId: number
): Promise<ProjectFindingDetails> => {
  const key = projectFindingKey(projectId, issueId)

  const fromCache = projectFindingsQuery.data?.[key]

  if (isDefined(fromCache?.data)) {
    logger.debug(
      `project finding already synced. project: ${projectId}, issue: ${issueId}`
    )
    return fromCache.data
  }

  logger.debug(`syncing project: ${projectId} and issue: ${issueId}`)

  const discussions = await fetchPaginated(({ perPage, page }) =>
    gitlabClient.discussions({ perPage, page, projectId, issueId })
  )

  const normalized = normalizeProjectFinding(discussions, projectId, issueId)

  logger.debug(
    `normalized finding for project: ${projectId} and issue: ${issueId}`,
    normalized
  )

  return normalized
}
