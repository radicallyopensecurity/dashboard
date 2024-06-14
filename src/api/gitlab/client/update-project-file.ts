import { config } from '@/config'

import { handleResponse } from '@/utils/fetch/handle-response'

import { GitLabProjectFile } from '../types/gitlab-project-file'

export type UpdateProjectFile = {
  id: number
  path: string
  branch: string
  content: string
  commitMessage: string
}

export const updateProjectFile = async ({
  id,
  path,
  branch = 'main',
  content,
  commitMessage,
}: UpdateProjectFile): Promise<GitLabProjectFile> => {
  const url = new URL(
    `${config.app.gitlabBaseUrl}/projects/${id}/repository/files/${encodeURIComponent(path)}`
  )

  const body = {
    branch,
    content,
    commit_message: commitMessage,
  }

  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return handleResponse(response)
}
