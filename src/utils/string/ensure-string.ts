export const ensureString = (name: string, value?: string): string => {
  if (!value) {
    throw new Error(`${name} not defined`)
  }

  return value
}
