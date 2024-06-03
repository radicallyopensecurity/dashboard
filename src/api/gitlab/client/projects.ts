import { config } from '@/config'

import { GitLabProject } from '@/api/gitlab/types/gitlab-project'

import { handleResponse } from '@/utils/fetch/handle-response'

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

  const response = await fetch(url)
  return handleResponse(response)
}
