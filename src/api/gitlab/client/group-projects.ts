import { config } from '@/config'

import { handleResponse } from '@/utils/fetch/handle-response'

import { GitLabProject } from '../types/gitlab-project'

type GetGitLabGroupProjects = {
  path: string
  scope?: 'projects'
  perPage?: number
}

export const groupProjects = async ({
  path,
  perPage = 100,
  scope,
}: GetGitLabGroupProjects): Promise<GitLabProject[]> => {
  const url = new URL(`${config.app.gitlabBaseUrl}/groups/${path}/projects`)

  url.searchParams.set('per_page', perPage?.toString() ?? '')
  url.searchParams.set('scope', scope ?? '')

  const response = await fetch(url)
  return handleResponse(response)
}
