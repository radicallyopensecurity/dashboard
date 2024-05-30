import { config } from '@/config'

import { CONTENT_TYPE, CONTENT_TYPE_JSON } from '@/constants/http'

import { handleResponse } from '@/utils/fetch/handle-response'

import { GitLabProject } from '../../types/gitlab-project'

export type UpdateGitLabProject = Omit<Partial<GitLabProject>, 'id'>

export const updateProject = async (
  id: number,
  params: UpdateGitLabProject
): Promise<GitLabProject> => {
  const url = new URL(`${config.app.gitlabBaseUrl}/projects/${id}`)

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      [CONTENT_TYPE]: CONTENT_TYPE_JSON,
    },
    body: JSON.stringify(params),
  })

  return handleResponse(response)
}
