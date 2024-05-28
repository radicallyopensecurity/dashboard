import { config } from '@/config'

import { handleResponse } from '@/utils/fetch/handle-response'

import { GitLabEvent } from '@/api/gitlab/types/gitlab-event'
import { type FetchPaginatedParameters } from '@/api/gitlab/utils/fetch-paginated'

export const events = async ({
  perPage,
  page,
  id,
}: FetchPaginatedParameters & { id: number }): Promise<GitLabEvent[]> => {
  const url = new URL(`${config.app.gitlabBaseUrl}/projects/${id}/events`)

  url.searchParams.set('target', 'issue')
  url.searchParams.set('per_page', perPage?.toString() ?? '')
  url.searchParams.set('page', page?.toString() ?? '')

  const response = await fetch(url)
  return handleResponse(response)
}
