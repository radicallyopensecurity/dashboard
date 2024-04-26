import { config } from '@/config'

import { handleResponse } from '@/utils/fetch/handle-response'
import { createLogger } from '@/utils/logging/create-logger'

import { GitLabUser } from '@/modules/gitlab/types/gitlab-user'

const logger = createLogger('gitlab-user')

export const user = async (): Promise<GitLabUser> => {
  const url = `${config.app.gitlabBaseUrl}/user`
  logger.info(`${url} fetching...`)
  const response = await fetch(url)
  return handleResponse(response)
}
