import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

@customElement('not-found-page')
export class NotFoundPage extends LitElement {
  static styles = [...theme]

  render() {
    return html` <h1>Not Found</h1>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'not-found-page': NotFoundPage
  }
}
