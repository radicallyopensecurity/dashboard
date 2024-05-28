import { config } from '@/config'

import { handleResponse } from '@/utils/fetch/handle-response'

import { GitLabUser } from '@/api/gitlab/types/gitlab-user'

export const user = async (): Promise<GitLabUser> => {
  const url = `${config.app.gitlabBaseUrl}/user`
  const response = await fetch(url)
  return handleResponse(response)
}
