import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { eyedpOidc } from '../../auth/eyedp-oidc'
import { createLogger } from '../../utils/logger'

const ELEMENT_NAME = 'auth-callback'

const logger = createLogger(ELEMENT_NAME)

@customElement(ELEMENT_NAME)
export class AuthCallback extends LitElement {
  @property({ type: Boolean || null })
  private isAuthenticated: boolean | null = null

  protected async firstUpdated() {
    logger.debug('executing eyedp callback')
    const { callbackPath } = await eyedpOidc.loginCallbackAsync()
    if (eyedpOidc.tokens) {
      logger.debug('callback successful')
      this.isAuthenticated = true
      // TODO: proper client side navigation
      window.location.href = callbackPath
      return
    }

    logger.debug('callback unsuccessful. see development console')
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
