import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

const ELEMENT_NAME = 'side-bar'

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: SideBar
  }
}

@customElement(ELEMENT_NAME)
export class SideBar extends LitElement {
  render() {
    return html`<nav>Sidebar</nav>`
  }
}
