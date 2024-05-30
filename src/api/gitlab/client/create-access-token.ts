import { config } from '@/config'

import { CONTENT_TYPE, CONTENT_TYPE_JSON } from '@/constants/http'

import { handleResponse } from '@/utils/fetch/handle-response'

export type CreateGitLabAccessToken = {
  scopes: string[]
  name: string
  expires_at: Date
}

export const createAccessToken = async (
  id: number,
  params: CreateGitLabAccessToken
): Promise<{ token: string }> => {
  const url = new URL(
    `${config.app.gitlabBaseUrl}/projects/${id}/access_tokens`
  )

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      [CONTENT_TYPE]: CONTENT_TYPE_JSON,
    },
    body: JSON.stringify(params),
  })

  return handleResponse(response)
}
