import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

const ELEMENT_NAME = 'findings-card'

@customElement(ELEMENT_NAME)
export class FindingsCard extends LitElement {
  static styles = [...theme, css``]

  render() {
    return html`
      <sl-card>
        <h2>Findings</h2>
      </sl-card>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: FindingsCard
  }
}
