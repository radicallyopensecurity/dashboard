export const getChannelUrl = (baseUrl: string, channel: string): string => {
  return `https://${baseUrl}/group/${channel}?layout=embedded`
}
