import { config } from '@/config'

export const isCallbackRoute = (): boolean => {
  return window.location.href.includes(config.oidc.redirectPath)
}
