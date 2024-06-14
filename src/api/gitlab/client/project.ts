import { config } from '@/config'

import { handleResponse } from '@/utils/fetch/handle-response'

import { GitLabProject } from '../types/gitlab-project'

type GetGitLabProject = {
  id: number
}

export const project = async ({
  id,
}: GetGitLabProject): Promise<GitLabProject> => {
  const url = new URL(`${config.app.gitlabBaseUrl}/projects/${id}`)

  const response = await fetch(url)
  return handleResponse(response)
}
