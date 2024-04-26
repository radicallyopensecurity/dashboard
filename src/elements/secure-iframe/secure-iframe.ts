import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

import { createIframe } from '@/elements/secure-iframe/utils/create-iframe'

const ELEMENT_NAME = 'secure-iframe'

@customElement(ELEMENT_NAME)
export class SecureIframe extends LitElement {
  @property()
  private src = ''

  static styles = [
    ...theme,
    css`
      iframe {
        width: 100%;
        height: 100%;
        border: 0;
      }
    `,
  ]

  render() {
    const iframe = createIframe(this.src)

    return html`${iframe}`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: SecureIframe
  }
}
