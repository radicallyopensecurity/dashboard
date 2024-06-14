import { SignalWatcher } from '@lit-labs/preact-signals'
import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

import { authCallbackQuery } from '@/modules/auth/queries/auth-callback-query'
import { authEnsureQuery } from '@/modules/auth/queries/auth-ensure-query'

import { updateTitle } from '@/modules/app/utils/update-title'

const ELEMENT_NAME = 'auth-callback'

@customElement(ELEMENT_NAME)
export class AuthCallback extends SignalWatcher(LitElement) {
  protected async firstUpdated() {
    updateTitle('login')

    const callbackPath = await authCallbackQuery.fetch()
    if (callbackPath) {
      // router.navigate doesn't navigate parent routes
      window.location.href = callbackPath
    }
  }

  static styles = [...theme]

  render() {
    const isAuthenticated = authEnsureQuery.data

    let text = ''
    switch (isAuthenticated) {
      case false:
        text = 'Oops. An error occured while authenticating...'
        break

      case true:
        text = 'Authentication succesful. Redirecting...'
        break

      default:
        text = 'Authenticating...'
        break
    }

    return html`<h1>${text}</h1>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: AuthCallback
  }
}
