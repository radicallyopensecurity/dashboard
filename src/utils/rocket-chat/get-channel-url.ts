export const getChannelUrl = (baseUrl: string, channel: string): string => {
  return `${baseUrl}/group/${channel}?layout=embedded`
}
