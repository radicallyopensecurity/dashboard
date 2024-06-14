import { config } from '@/config'

import { handleResponse } from '@/utils/fetch/handle-response'

import { GitLabProjectFile } from '../types/gitlab-project-file'

type ProjectFile = {
  id: number
  path: string
  branch?: string
}

export const projectFile = async ({
  id,
  path,
  branch = 'main',
}: ProjectFile): Promise<GitLabProjectFile> => {
  const url = new URL(
    `${config.app.gitlabBaseUrl}/projects/${id}/repository/files/${encodeURIComponent(path)}`
  )

  url.searchParams.set('ref', branch)

  const response = await fetch(url)
  return handleResponse(response)
}
