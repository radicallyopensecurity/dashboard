import { Project } from '../types/project'

import { ChatSubscriptionMap } from '@/modules/chat/signals/chat-subscriptions-signal'
import { ChatSubscription } from '@/modules/chat/types/chat-subscription'

export type ProjectWithChannelNames = {
  project: Project
  quoteChannel?: ChatSubscription
  pentestChannel?: ChatSubscription
}

export const addChannelNames = (
  projects: Project[],
  chatMap: ChatSubscriptionMap
): ProjectWithChannelNames[] => {
  const result = projects.map((project) => {
    let baseName = project.name

    if (baseName.startsWith('pen-') || baseName.startsWith('off-')) {
      baseName = baseName.slice(4)
    }

    const quoteChannel = chatMap[`off-${baseName}`]
    const pentestChannel = chatMap[`pen-${baseName}`]

    return {
      project,
      quoteChannel,
      pentestChannel,
    }
  })

  return result
}
