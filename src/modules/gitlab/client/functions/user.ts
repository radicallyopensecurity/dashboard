import { config } from '@/config'

import { GitLabUser } from '@/modules/gitlab/types/gitlab-user'

import { handleResponse } from '@/utils/fetch/handle-response'

export const user = async (): Promise<GitLabUser> => {
  const url = `${config.app.gitlabBaseUrl}/user`
  const response = await fetch(url)
  return handleResponse(response)
}
