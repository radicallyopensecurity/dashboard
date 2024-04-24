import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js'
import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { ensureAuth } from '@/auth/ensure-auth'

import { user } from '@/state/user'

import { registerTheme } from '@/utils/browser/register-theme'
import { createLogger } from '@/utils/logging/create-logger'

import { theme } from '@/theme/theme'

import '@/theme/light.css'
import '@/theme/dark.css'
import '@/theme/base.css'

setBasePath('/assets')

const ELEMENT_NAME = 'app-shell'

const logger = createLogger(ELEMENT_NAME)

@customElement(ELEMENT_NAME)
export class AppShell extends LitElement {
  private user = user

  protected async firstUpdated() {
    registerTheme()

    const userInfo = await ensureAuth(window.location.pathname)
    if (userInfo) {
      logger.info('setting userinfo')
      this.user.set(userInfo)
    }
  }

  static styles = [
    ...theme,
    css`
      body {
        padding: 0;
        margin: 0;
      }
      :host {
        display: flex;
        flex-direction: column;
      }
    `,
  ]

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
