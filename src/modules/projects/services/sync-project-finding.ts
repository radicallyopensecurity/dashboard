import { toJS } from 'mobx'

import { GitLabClient } from '@/api/gitlab/gitlab-client'
import { fetchPaginated } from '@/api/gitlab/utils/fetch-paginated'

import { createLogger } from '@/utils/logging/create-logger'

import { normalizeProjectFinding } from '../normalizers/normalize-project-finding'
import { ProjectFindingsStore } from '../store/project-findings-store'
import { projectFindingKey } from '../utils/project-finding-key'

const logger = createLogger('sync-project-discussion')

export const syncProjectFinding =
  (client: GitLabClient, store: ProjectFindingsStore, baseUrl: string) =>
  async (projectId: number, issueId: number) => {
    if (toJS(store.data)[projectFindingKey(projectId, issueId)]) {
      logger.debug(
        `project finding already synced. project: ${projectId}, issue: ${issueId}`
      )
      return
    }

    logger.debug(`syncing project: ${projectId} and issue: ${issueId}`)

    store.setIsLoading(projectId, issueId, true)

    const discussions = await fetchPaginated(({ perPage, page }) =>
      client.discussions({ perPage, page, projectId, issueId })
    )

    const normalized = normalizeProjectFinding(
      discussions,
      projectId,
      issueId,
      baseUrl
    )

    logger.debug(
      `normalized finding for project: ${projectId} and issue: ${issueId}`,
      normalized
    )
    store.set(normalized)
    store.setIsLoading(projectId, issueId, false)
  }
