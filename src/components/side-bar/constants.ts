import { config } from '@/config'

export const SERVICES = [
  {
    title: 'Rocket.Chat',
    icon: 'rocket-takeoff',
    href: config.services.rocketChatUrl,
  },
  {
    title: 'GitLab',
    icon: 'gitlab',
    href: config.services.gitlabUrl,
  },
  {
    title: 'CodiMD',
    icon: 'journals',
    href: config.services.codiMdUrl,
  },
]
