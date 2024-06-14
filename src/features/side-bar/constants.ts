import { config } from '@/config'

export type Service = {
  title: string
  icon: string
  href: string
}

export const SERVICES: Service[] = [
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
