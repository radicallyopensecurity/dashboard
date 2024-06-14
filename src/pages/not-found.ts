import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

import { updateTitle } from '@/modules/app/utils/update-title'

@customElement('not-found-page')
export class NotFoundPage extends LitElement {
  static styles = [...theme]

  protected firstUpdated() {
    updateTitle('Not found')
  }

  render() {
    return html` <h1>Not Found</h1>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'not-found-page': NotFoundPage
  }
}
