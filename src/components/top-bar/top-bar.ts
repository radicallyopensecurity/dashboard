import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

const ELEMENT_NAME = 'top-bar'

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: NavBar
  }
}

@customElement(ELEMENT_NAME)
export class NavBar extends LitElement {
  render() {
    return html`<nav>
      <a href="/">Home</a>
      <a href="/projects/new">New Project</a>
      <a href="/projects/3">Project 3</a>
      <a href="/projects/4">Project 4</a>
      <a href="/fafasfa">404</a>
    </nav>`
  }
}
