import { config } from '@/config'


import { type GitLabDiscussion } from '@/api/gitlab/types/gitlab-discussion'
import { type FetchPaginatedParameters } from '@/api/gitlab/utils/fetch-paginated'

import { handleResponse } from '@/utils/fetch/handle-response'

export const discussions = async ({
  perPage,
  page,
  projectId,
  issueId,
}: FetchPaginatedParameters & { projectId: number; issueId: number }): Promise<
  GitLabDiscussion[]
> => {
  const url = new URL(
    `${config.app.gitlabBaseUrl}/projects/${projectId}/issues/${issueId}/discussions`
  )

  url.searchParams.set('per_page', perPage?.toString() ?? '')
  url.searchParams.set('page', page?.toString() ?? '')

  const response = await fetch(url)
  return handleResponse(response)
}
