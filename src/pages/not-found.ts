import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('not-found-page')
export class NotFoundPage extends LitElement {
  render() {
    return html` <h1>Not Found</h1>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'not-found-page': NotFoundPage
  }
}
