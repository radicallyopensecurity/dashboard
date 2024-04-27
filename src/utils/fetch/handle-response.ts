import { handleError } from './handle-error'

// TODO: abort controller
export const handleResponse = async <T>(response: Response): Promise<T> => {
  await handleError(response)
  const json = (await response.json()) as unknown as T
  return json
}
