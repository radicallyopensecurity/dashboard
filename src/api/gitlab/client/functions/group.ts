import { config } from '@/config'

import { handleResponse } from '@/utils/fetch/handle-response'

import { GitLabLabel } from '@/api/gitlab/types/gitlab-label'

type GetGitLabGroup = {
  id: number
}

export const group = async ({ id }: GetGitLabGroup): Promise<GitLabLabel[]> => {
  const url = new URL(`${config.app.gitlabBaseUrl}/groups/${id}`)

  const response = await fetch(url)
  return handleResponse(response)
}
