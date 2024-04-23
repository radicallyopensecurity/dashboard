import {
  OidcClient,
  TokenAutomaticRenewMode,
  TokenRenewMode,
} from '@axa-fr/oidc-client'

import { config } from '@/config'

export const authClient = OidcClient.getOrCreate(() => fetch)({
  client_id: config.oidc.clientId,
  authority: config.oidc.authority,
  scope: config.oidc.scope,
  redirect_uri: `${window.location.origin}${config.oidc.redirectPath}`,
  service_worker_relative_url: '/OidcServiceWorker.js',
  refresh_time_before_tokens_expiration_in_second: 40,
  service_worker_only: true,
  token_renew_mode: TokenRenewMode.access_token_invalid,
  token_automatic_renew_mode:
    TokenAutomaticRenewMode.AutomaticOnlyWhenFetchExecuted,
})
