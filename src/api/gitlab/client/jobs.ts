import { config } from '@/config'

import { type FetchPaginatedParameters } from '@/api/gitlab/utils/fetch-paginated'

import { handleResponse } from '@/utils/fetch/handle-response'

import { GitLabJob } from '../types/gitlab-job'

type GitLabJobScope =
  | 'created'
  | 'pending'
  | 'running'
  | 'failed'
  | 'success'
  | 'canceled'
  | 'skipped'
  | 'waiting_for_resource'
  | 'manual'

type Parameters = FetchPaginatedParameters & {
  projectId: number
  scopes?: GitLabJobScope[]
}

export const jobs = async ({
  perPage,
  page,
  projectId,
  scopes = [],
}: Parameters): Promise<GitLabJob[]> => {
  const url = new URL(`${config.app.gitlabBaseUrl}/projects/${projectId}/jobs`)

  url.searchParams.set('per_page', perPage?.toString() ?? '')
  url.searchParams.set('page', page?.toString() ?? '')

  for (const scope of scopes) {
    url.searchParams.append('scope[]', scope)
  }

  const response = await fetch(url)
  return handleResponse(response)
}
