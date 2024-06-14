export const handleError = async (response: Response): Promise<void> => {
  const { url } = response

  if (!response.ok) {
    const text = await response.text()

    throw new Error(`Fetch failed for ${url} with response ${text}`)
  }
}
