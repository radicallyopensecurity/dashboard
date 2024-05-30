import { config } from '@/config'


import { GitLabLabel } from '@/api/gitlab/types/gitlab-label'
import { type FetchPaginatedParameters } from '@/api/gitlab/utils/fetch-paginated'

import { handleResponse } from '@/utils/fetch/handle-response'

export const labels = async ({
  perPage,
  page,
  id,
}: FetchPaginatedParameters & { id: number }): Promise<GitLabLabel[]> => {
  const url = new URL(`${config.app.gitlabBaseUrl}/projects/${id}/labels`)

  url.searchParams.set('per_page', perPage?.toString() ?? '')
  url.searchParams.set('page', page?.toString() ?? '')

  const response = await fetch(url)
  return handleResponse(response)
}
