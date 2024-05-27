import { toJS } from 'mobx'

import { GitLabService } from '@/modules/gitlab/gitlab-service'

import { normalizeProjectDetails } from '@/modules/projects/normalizers/normalize-project-details'
import { ProjectDetailsStore } from '@/modules/projects/project-details-store'

import { createLogger } from '@/utils/logging/create-logger'

const logger = createLogger('sync-project-details')

export const syncProjectDetails =
  (service: GitLabService, store: ProjectDetailsStore) =>
  async (id: number, mode: 'cache' | 'network' = 'cache') => {
    if (mode === 'cache' && toJS(store.data)[id]?.data) {
      return
    }

    logger.debug(`syncing project with name: ${id}...`)

    store.setIsLoading(id, true)

    const [events, issues, labels, members, variables] = await Promise.all([
      service.events(id),
      service.issues(id),
      service.labels(id),
      service.members(id),
      service.variables(id),
    ])

    const normalized = normalizeProjectDetails(
      id,
      events,
      issues,
      labels,
      members,
      variables
    )

    logger.debug(`normalized project details with id: ${id}`, normalized)
    store.set(normalized)
    store.setIsLoading(id, false)
  }
