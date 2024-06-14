export const getChannelUrls = (
  baseUrl: string,
  project: string
): { quote: string; pentest: string } => {
  let baseName = project

  // old style project names
  if (baseName.startsWith('off-') || baseName.startsWith('pen-')) {
    baseName = baseName.slice(4)
  }

  return {
    quote: `${baseUrl}/group/off-${baseName}?layout=embedded`,
    pentest: `${baseUrl}/group/pen-${baseName}?layout=embedded`,
  }
}
