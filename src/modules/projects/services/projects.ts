import { PENTEST_PROJECT_TAG, QUOTE_PROJECT_TAG } from '@/constants/projects'

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

  const projects = await fetchPaginated(({ page, perPage }) =>
    gitlabClient.projects({ page, perPage })
  )

  const withoutIgnored = projects
    .filter((x) => !IGNORED_NAMESPACES_MAP[x.namespace.path])
    .filter(
      (x) =>
        x.topics.includes(QUOTE_PROJECT_TAG) ||
        x.topics.includes(PENTEST_PROJECT_TAG) ||
        x.topics.includes('quote')
    )

  const projectsWithFile = await Promise.all(
    withoutIgnored.map(async (project) => {
      try {
        const quote = await gitlabClient.projectFile({
          id: project.id,
          path: 'source/offerte.xml',
          branch: 'main',
        })
        return { quote, project }
      } catch (err) {
        return { quote: null, project }
      }
    })
  )

  const normalized = projectsWithFile.map((x) =>
    normalizeProject(x.project, x.quote)
  )

  const grouped = groupProjects(normalized)
  logger.debug('data', grouped)

  return grouped
}
