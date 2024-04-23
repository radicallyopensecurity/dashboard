export const requiredEnvVariable = (value: string | undefined): string => {
  if (!value) {
    throw new Error(
      // exclude empty strings as well
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      `Invalid value for environment variable: "${value || 'UNDEFINED'}".`
    )
  }
  return value
}
