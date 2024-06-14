import { config } from '@/config'

import { GitLabMember } from '@/api/gitlab/types/gitlab-member'
import { type FetchPaginatedParameters } from '@/api/gitlab/utils/fetch-paginated'

import { handleResponse } from '@/utils/fetch/handle-response'

export const members = async ({
  perPage,
  page,
  id,
}: FetchPaginatedParameters & { id: number }): Promise<GitLabMember[]> => {
  const url = new URL(`${config.app.gitlabBaseUrl}/projects/${id}/members`)

  url.searchParams.set('per_page', perPage?.toString() ?? '')
  url.searchParams.set('page', page?.toString() ?? '')

  const response = await fetch(url)
  return handleResponse(response)
}
