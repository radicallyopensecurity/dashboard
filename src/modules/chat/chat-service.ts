import { chatSubscriptionsSignal } from './signals/chat-subscriptions-signal'
import {
  RocketChatEvent,
  onRocketChatMessage,
} from './utils/on-rocket-chat-event'

export type ChatServiceResult = {
  disconnect: () => void
}

type RocketChatNormalEvent = {
  eventName: string
}

const isRocketChatMessage = (
  e: MessageEvent<RocketChatEvent> | MessageEvent<RocketChatNormalEvent>
): e is MessageEvent<RocketChatEvent> => {
  return Boolean((e as MessageEvent<RocketChatEvent>).data.type)
}

const isRocketChatNormalEvent = (
  e: MessageEvent<RocketChatEvent> | MessageEvent<RocketChatNormalEvent>
): e is MessageEvent<RocketChatNormalEvent> => {
  return Boolean((e as MessageEvent<RocketChatNormalEvent>).data.eventName)
}

const ONE_MINUTE = 1000 * 60

export const chatService = (iframe: HTMLIFrameElement): ChatServiceResult => {
  let init = false
  let interval: NodeJS.Timeout | null = null

  window.addEventListener(
    'message',
    (
      e: MessageEvent<RocketChatEvent> | MessageEvent<RocketChatNormalEvent>
    ) => {
      isRocketChatMessage(e) && onRocketChatMessage(e)

      if (init) {
        return
      }

      if (
        isRocketChatNormalEvent(e) &&
        e.data.eventName !== 'Custom_Script_Logged_In'
      ) {
        return
      }

      init = true

      chatSubscriptionsSignal.refresh(iframe)

      interval = setInterval(() => {
        chatSubscriptionsSignal.refresh(iframe)
      }, ONE_MINUTE)
    }
  )

  return {
    disconnect: () => {
      if (interval) {
        clearInterval(interval)
      }

      window.removeEventListener(
        'message',
        (e: MessageEvent<RocketChatEvent>) => {
          onRocketChatMessage(e)
        }
      )
    },
  }
}
