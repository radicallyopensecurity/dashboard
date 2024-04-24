import { handleResponse } from '@/utils/fetch/handle-response'
import { createLogger } from '@/utils/logging/create-logger'

import { GitLabProject } from '../types/gitlab-project'

import { config } from '@/config'

const logger = createLogger('gitlab-projects')

type GetGitLabProjectsParams = {
  perPage?: number
  page?: number
}

export const projects = async (
  params: GetGitLabProjectsParams
): Promise<GitLabProject[]> => {
  const url = new URL(`${config.app.gitlabBaseUrl}/projects`)

  url.searchParams.set('per_page', params.perPage?.toString() ?? '')
  url.searchParams.set('page', params.page?.toString() ?? '')

  logger.info(`${url.toString()} fetching...`)

  const response = await fetch(url)
  return handleResponse(response)
}
