import { CreateGitLabVariable } from '@/api/gitlab/client/create-variable'
import { gitlabClient } from '@/api/gitlab/gitlab-client'

import { createLogger } from '@/utils/logging/create-logger'

const logger = createLogger('create-variable')

export const createVariable = async (
  id: number,
  payload: CreateGitLabVariable
): Promise<void> => {
  logger.debug('creating project...')
  await gitlabClient.createVariable(id, payload)
}
