import { toJS } from 'mobx'

import { type GitLabService } from '@/modules/gitlab/gitlab-service'

import { createLogger } from '@/utils/logging/create-logger'

import { normalizeProjectFinding } from '../normalizers/normalize-project-finding'
import { ProjectFindingsStore } from '../project-findings-store'
import { projectFindingKey } from '../utils/project-finding-key'

const logger = createLogger('sync-project-discussion')

export const syncProjectFinding =
  (service: GitLabService, store: ProjectFindingsStore, baseUrl: string) =>
  async (projectId: number, issueId: number) => {
    if (toJS(store.data)[projectFindingKey(projectId, issueId)]) {
      logger.debug(
        `project finding already synced. project: ${projectId}, issue: ${issueId}`
      )
      return
    }

    logger.debug(`syncing project: ${projectId} and issue: ${issueId}`)

    store.setIsLoading(projectId, issueId, true)

    const discussions = await service.discussions(projectId, issueId)

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
