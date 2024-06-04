import { gitlabClient } from '@/api/gitlab/gitlab-client'

import { normalizeProjectDetails } from '@/modules/projects/normalizers/normalize-project-details'

import { createLogger } from '@/utils/logging/create-logger'

import { ProjectDetails } from '../types/project-details'

const logger = createLogger('sync-project-details')

export const syncProjectDetails = async (
  id: number,
  // #TODO: move this to create-query
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _mode: 'cache' | 'network' = 'cache'
): Promise<ProjectDetails> => {
  logger.debug(`syncing project with name: ${id}...`)

  const [events, issues, labels, members, variables] = await Promise.all([
    gitlabClient.events({ id }),
    gitlabClient.issues({ id }),
    gitlabClient.labels({ id }),
    gitlabClient.members({ id }),
    gitlabClient.variables({ id }),
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
  return normalized
}
