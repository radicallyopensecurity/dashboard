import { config } from '@/config'

import { GitLabEvent } from '@/modules/gitlab/types/gitlab-event'
import { type FetchPaginatedParameters } from '@/modules/gitlab/utils/fetch-paginated'

import { handleResponse } from '@/utils/fetch/handle-response'

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
