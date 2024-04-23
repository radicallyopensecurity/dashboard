import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { ensureAuth } from './auth/ensure-auth'
import { user } from './state/user'
import { createLogger } from './utils/logger'

const ELEMENT_NAME = 'app-shell'

const logger = createLogger(ELEMENT_NAME)

@customElement(ELEMENT_NAME)
export class AppShell extends LitElement {
  private user = user

  protected async firstUpdated() {
    const userInfo = await ensureAuth(window.location.pathname)
    if (userInfo) {
      logger.debug('setting userinfo')
      this.user.set(userInfo)
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
