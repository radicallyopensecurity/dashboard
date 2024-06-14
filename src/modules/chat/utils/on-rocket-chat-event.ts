import { groupBy } from '@/utils/array/group-by'

import { normalizeChatSubscription } from '../normalizers/normalize-chat-subscription'
import { chatSubscriptionsSignal } from '../signals/chat-subscriptions-signal'
import { RocketChatSubscription } from '../types/rocket-chat-subscription'

type RocketChatEventBase = {
  type: 'meteor-call-response'
  error?: string
}

type RocketChatSubscriptionEvent = RocketChatEventBase & {
  method: 'subscriptions/get'
  data: RocketChatSubscription[]
}

export type RocketChatEvent = RocketChatSubscriptionEvent

export const onRocketChatMessage = (e: MessageEvent<RocketChatEvent>) => {
  if (e.data.type !== 'meteor-call-response') {
    return
  }

  if (e.data.method === 'subscriptions/get') {
    const normalized = e.data.data.map(normalizeChatSubscription)
    const grouped = groupBy((x) => x.project, normalized)
    chatSubscriptionsSignal.setValue(grouped)
  }
}
