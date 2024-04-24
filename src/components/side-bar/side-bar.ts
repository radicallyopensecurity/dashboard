import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

const ELEMENT_NAME = 'side-bar'

@customElement(ELEMENT_NAME)
export class SideBar extends LitElement {
  static styles = [
    ...theme,
    css`
      :host {
        min-width: 350px;
        max-width: 350px;
        padding-top: var(--sl-spacing-large);
        background: white;
      }
    `,
  ]
  render() {
    return html`Sidebar`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: SideBar
  }
}
