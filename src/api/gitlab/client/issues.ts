import { config } from '@/config'


import { GitLabIssue } from '@/api/gitlab/types/gitlab-issue'
import { type FetchPaginatedParameters } from '@/api/gitlab/utils/fetch-paginated'

import { handleResponse } from '@/utils/fetch/handle-response'

export const issues = async ({
  perPage,
  page,
  id,
}: FetchPaginatedParameters & { id: number }): Promise<GitLabIssue[]> => {
  const url = new URL(`${config.app.gitlabBaseUrl}/projects/${id}/issues`)

  url.searchParams.set('per_page', perPage?.toString() ?? '')
  url.searchParams.set('page', page?.toString() ?? '')

  const response = await fetch(url)
  return handleResponse(response)
}
