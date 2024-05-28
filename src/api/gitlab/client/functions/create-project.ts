import { config } from '@/config'

import { CONTENT_TYPE, CONTENT_TYPE_JSON } from '@/constants/http'

import { handleResponse } from '@/utils/fetch/handle-response'

import { GitLabProject } from '../../types/gitlab-project'

const DEFAULT_OPTIONS: Partial<CreateGitLabProject> = {
  default_branch: 'main',
  wiki_access_level: 'disabled',
  pages_access_level: 'disabled',
  issues_access_level: 'private',
  packages_enabled: false,
  enforce_auth_checks_on_uploads: false,
}

export type CreateGitLabProject = {
  import_url: string
  default_branch: string
  wiki_access_level: string
  pages_access_level: string
  issues_access_level: string
  path: string
  packages_enabled: false
  namespace_id: number
  topics: string[]
  enforce_auth_checks_on_uploads: false
}

export const createProject = async (
  params: Partial<CreateGitLabProject>,
  token: string
): Promise<GitLabProject> => {
  const url = new URL(`${config.app.gitlabBaseUrl}/projects`)

  const body = {
    ...DEFAULT_OPTIONS,
    ...params,
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      [CONTENT_TYPE]: CONTENT_TYPE_JSON,
      'PRIVATE-TOKEN': token,
    },
    body: JSON.stringify(body),
  })

  return handleResponse(response)
}
