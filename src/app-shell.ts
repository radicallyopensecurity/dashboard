import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { ensureAuth } from './auth/ensure-auth'

const ELEMENT_NAME = 'app-shell'

@customElement(ELEMENT_NAME)
export class AppShell extends LitElement {
  protected async firstUpdated() {
    const userInfo = await ensureAuth(window.location.pathname)
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
