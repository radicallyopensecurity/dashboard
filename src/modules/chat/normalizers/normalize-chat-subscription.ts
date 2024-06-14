import { ChatSubscription } from '../types/chat-subscription'
import { RocketChatSubscription } from '../types/rocket-chat-subscription'

export const normalizeChatSubscription = (
  raw: RocketChatSubscription
): ChatSubscription => {
  return {
    project: raw.name,
    unread: raw.unread,
    mentions: raw.userMentions,
    lastUpdatedAt: raw.ls,
  }
}
