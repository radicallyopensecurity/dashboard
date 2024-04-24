import { createLogger } from '../logging/create-logger'

import { handleError } from './handle-error'

const logger = createLogger('handle-response')

// TODO: abort controller
export const handleResponse = async <T>(response: Response): Promise<T> => {
  await handleError(response)
  const json = (await response.json()) as unknown as T
  logger.debug(`${response.url} response:`, json)
  return json
}
