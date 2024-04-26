import { createLogger } from '@/utils/logging/create-logger'

import { projects } from '@/modules/gitlab/functions/projects'
import { type GitLabProject } from '@/modules/gitlab/types/gitlab-project'

const logger = createLogger('all-projects')

const PER_PAGE = 50

export const allProjects = async (): Promise<GitLabProject[]> => {
  let page = 0
  let complete = false

  let data: GitLabProject[] = []

  while (!complete) {
    logger.info(`fetching page: ${page}, per page: ${PER_PAGE}`)

    const result = await projects({ page, perPage: PER_PAGE })

    if (!result.length) {
      complete = true
      break
    }

    data = data.concat(result)
    page += 1
  }

  logger.info('fetched all projects')
  logger.debug('data', data)

  return data
}
