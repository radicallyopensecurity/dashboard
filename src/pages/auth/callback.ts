import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { authClient } from '@/auth/auth-client'

import { createLogger } from '@/utils/logging/create-logger'

const ELEMENT_NAME = 'auth-callback'

const logger = createLogger(ELEMENT_NAME)

@customElement(ELEMENT_NAME)
export class AuthCallback extends LitElement {
  @property({ type: Boolean || null })
  private isAuthenticated: boolean | null = null

  protected async firstUpdated() {
    logger.info('executing eyedp callback')
    const { callbackPath } = await authClient.loginCallbackAsync()
    if (authClient.tokens) {
      logger.info('callback successful')
      this.isAuthenticated = true
      // TODO: proper client side navigation
      window.location.href = callbackPath
      return
    }

    logger.info('callback unsuccessful. see development console')
    this.isAuthenticated = false
  }

  render() {
    let text = ''
    switch (this.isAuthenticated) {
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
