import { createLogger } from '../logging/create-logger'

const logger = createLogger('handle-error')

export const handleError = async (response: Response): Promise<void> => {
  const { url } = response
  logger.info(`${url} validating response`)

  if (!response.ok) {
    logger.info(`${url} response NOT OK with status: ${response.status}`)

    const text = await response.text()
    logger.debug(`${url} response:`, text)

    throw new Error(`Fetch failed for ${url} with response ${text}`)
  }

  logger.info(`${url} response OK with status: ${response.status}`)
}
