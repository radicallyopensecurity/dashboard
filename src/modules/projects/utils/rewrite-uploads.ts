export const rewriteUploads = (value: string, baseUrl: string): string =>
  value.replaceAll('(/uploads/', `(${baseUrl}/uploads/`)
