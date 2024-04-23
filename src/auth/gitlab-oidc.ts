import { OidcClient } from '@axa-fr/oidc-client'

const configuration = {
  client_id: 'b54893843c18b8d3ae3c06f6c977224b256cedb9f330b7f21b0b1c97571b8c96', // #TODO: Variable
  redirect_uri: `${window.location.origin}/auth/gitlab/callback`,
  silent_redirect_uri: `${window.location.origin}/auth/gitlab/callback`,
  scope: 'openid profile email',
  authority: 'https://git.staging.radical.sexy', // #TODO: Variable
  refresh_time_before_tokens_expiration_in_second: 40,
  service_worker_relative_url: '/OidcServiceWorker.js',
  service_worker_only: true,
}

export const gitlabOidc = OidcClient.getOrCreate(() => fetch)(configuration)
