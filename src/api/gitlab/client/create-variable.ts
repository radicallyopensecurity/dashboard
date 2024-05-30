import { config } from '@/config'

import { CONTENT_TYPE, CONTENT_TYPE_JSON } from '@/constants/http'

import { handleResponse } from '@/utils/fetch/handle-response'

import { GitLabProject } from '../types/gitlab-project'

export type CreateGitLabVariable = {
  key: string
  value: string
  protected: boolean
  masked: boolean
}

export const createVariable = async (
  id: number,
  params: CreateGitLabVariable
): Promise<GitLabProject> => {
  const url = new URL(`${config.app.gitlabBaseUrl}/projects/${id}/variables`)

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      [CONTENT_TYPE]: CONTENT_TYPE_JSON,
    },
    body: JSON.stringify(params),
  })

  return handleResponse(response)
}
