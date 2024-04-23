import {
  OidcClient,
  TokenAutomaticRenewMode,
  TokenRenewMode,
} from '@axa-fr/oidc-client'

export const eyedpOidc = OidcClient.getOrCreate(() => fetch)({
  client_id: import.meta.env['VITE_EYEDP_CLIENT_ID'],
  redirect_uri: `${window.location.origin}/auth/callback`,
  scope: 'openid profile email',
  authority: import.meta.env['VITE_EYEDP_AUTHORITY'],
  refresh_time_before_tokens_expiration_in_second: 40,
  service_worker_relative_url: '/OidcServiceWorker.js',
  service_worker_only: true,
  token_renew_mode: TokenRenewMode.access_token_invalid,
  token_automatic_renew_mode:
    TokenAutomaticRenewMode.AutomaticOnlyWhenFetchExecuted,
})

export const isEyedpCallbackRoute = (): boolean => {
  return window.location.href.includes('/auth/callback')
}
