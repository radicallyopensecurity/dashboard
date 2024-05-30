import { toJS } from 'mobx'

import { GitLabClient } from '@/api/gitlab/gitlab-client'

import { normalizeProjectDetails } from '@/modules/projects/normalizers/normalize-project-details'
import { ProjectDetailsStore } from '@/modules/projects/store/project-details-store'

import { createLogger } from '@/utils/logging/create-logger'

const logger = createLogger('sync-project-details')

export const syncProjectDetails =
  (client: GitLabClient, store: ProjectDetailsStore) =>
  async (id: number, mode: 'cache' | 'network' = 'cache') => {
    if (mode === 'cache' && toJS(store.data)[id]?.data) {
      return
    }

    logger.debug(`syncing project with name: ${id}...`)

    store.setIsLoading(id, true)

    const [events, issues, labels, members, variables] = await Promise.all([
      client.events({ id }),
      client.issues({ id }),
      client.labels({ id }),
      client.members({ id }),
      client.variables({ id }),
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
