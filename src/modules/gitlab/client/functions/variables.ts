import { config } from '@/config'

import { GitLabVariable } from '@/modules/gitlab/types/gitlab-variable'
import { type FetchPaginatedParameters } from '@/modules/gitlab/utils/fetch-paginated'

import { handleResponse } from '@/utils/fetch/handle-response'

export const variables = async ({
  perPage,
  page,
  id,
}: FetchPaginatedParameters & { id: number }): Promise<GitLabVariable[]> => {
  const url = new URL(`${config.app.gitlabBaseUrl}/projects/${id}/variables`)

  url.searchParams.set('per_page', perPage?.toString() ?? '')
  url.searchParams.set('page', page?.toString() ?? '')

  const response = await fetch(url)
  return handleResponse(response)
}
