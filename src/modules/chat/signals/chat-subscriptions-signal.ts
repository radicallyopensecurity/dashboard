import { signal as createSignal } from '@lit-labs/preact-signals'

import { ChatSubscription } from '../types/chat-subscription'

export type ChatSubscriptionMap = Record<string, ChatSubscription>

type ChatSubscriptionsSignal = {
  subscriptions: ChatSubscriptionMap
  setValue: (value: ChatSubscriptionMap) => void
  refresh: (iframe: HTMLIFrameElement) => void
}

const subscriptionsSignal = createSignal<ChatSubscriptionMap>({})

export const chatSubscriptionsSignal: ChatSubscriptionsSignal = {
  get subscriptions() {
    return subscriptionsSignal.value
  },
  setValue: (value) => {
    subscriptionsSignal.value = value
  },
  refresh: (iframe) => {
    iframe.contentWindow?.postMessage(
      {
        type: 'meteor-call',
        method: 'subscriptions/get',
      },
      '*'
    )
  },
}
