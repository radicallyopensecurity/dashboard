import { handleResponse } from '@/utils/fetch/handle-response'
import { createLogger } from '@/utils/logging/create-logger'

import { GitLabUser } from '../types/gitlab-user'

import { config } from '@/config'

const logger = createLogger('user')

export const user = async (): Promise<GitLabUser> => {
  const url = `${config.app.gitlabBaseUrl}/user`
  logger.info(`${url} fetching gitlab user`)
  const response = await fetch(url)
  return handleResponse(response)
}
