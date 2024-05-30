import { config } from '@/config'

import { handleResponse } from '@/utils/fetch/handle-response'

import { GitLabGroup } from '../types/gitlab-group'

type GetGitLabGroups = {
  allAvailable: boolean
  minAccessLevel: number
}

export const groups = async ({
  allAvailable,
  minAccessLevel,
}: GetGitLabGroups): Promise<GitLabGroup[]> => {
  const url = new URL(`${config.app.gitlabBaseUrl}/groups`)

  url.searchParams.set('all_available', allAvailable ? 'true' : 'false')
  url.searchParams.set('min_access_level', minAccessLevel.toString())

  const response = await fetch(url)
  return handleResponse(response)
}
