import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { eyedpOidc, isEyedpCallbackRoute } from './auth/eyedp-oidc'
import { createLogger } from './utils/logger'

const ELEMENT_NAME = 'app-shell'

const logger = createLogger(ELEMENT_NAME)

@customElement(ELEMENT_NAME)
export class AppShell extends LitElement {
  protected async firstUpdated() {
    logger.debug('checking auth')

    if (!isEyedpCallbackRoute()) {
      logger.debug('is not callback route, checking auth session')

      const sessionStatus = await eyedpOidc.tryKeepExistingSessionAsync()
      logger.debug(`session found: ${sessionStatus}`)

      if (!eyedpOidc.tokens) {
        logger.debug(`authenticating with eyedp`)
        eyedpOidc.loginAsync(window.location.pathname)
      }
    }
  }

  render() {
    return html`<top-bar></top-bar>
      <main>
        <side-bar></side-bar>
        <app-routes></app-routes>
      </main>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: AppShell
  }
}
