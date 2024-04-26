import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

const ELEMENT_NAME = 'recent-changes-card'

@customElement(ELEMENT_NAME)
export class RecentChangesCard extends LitElement {
  static styles = [
    ...theme,
    css`
      :host {
      }
    `,
  ]

  render() {
    return html`
      <sl-card>
        <h2>Recent Changes</h2>
      </sl-card>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: RecentChangesCard
  }
}
