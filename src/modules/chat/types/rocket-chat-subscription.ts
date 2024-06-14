export type RocketChatSubscription = {
  _id: string
  rid: string
  u: {
    _id: string
    username: string
  }
  _updatedAt: Date
  alert: boolean
  fname: string
  groupMentions: number
  name: string
  open: boolean
  t: string
  unread: number
  userMentions: number
  ls: Date
}
