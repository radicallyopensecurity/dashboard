import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

import { authService } from '@/modules/auth/auth-service'
import { auth } from '@/modules/auth/auth-store'

const ELEMENT_NAME = 'auth-callback'

@customElement(ELEMENT_NAME)
export class AuthCallback extends LitElement {
  private auth = auth

  protected async firstUpdated() {
    await authService.loginCallback()
  }

  static styles = [...theme]

  render() {
    const { isAuthenticated } = this.auth

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
