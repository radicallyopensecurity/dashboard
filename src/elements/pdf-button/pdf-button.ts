import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

const ELEMENT_NAME = 'pdf-button'

@customElement(ELEMENT_NAME)
export class PdfButton extends LitElement {
  @property()
  downloadUrl = ''
  @property()
  previewUrl = ''
  @property()
  titleText = ''

  static styles = [
    ...theme,
    css`
      sl-menu {
        padding: 0;
      }

      sl-menu-item::part(base) {
        padding: 0;
      }

      sl-menu-item::part(checked-icon),
      sl-menu-item::part(suffix),
      sl-menu-item::part(submenu-icon) {
        display: none;
      }
    `,
  ]

  render() {
    const { downloadUrl, previewUrl, titleText } = this

    return html`<sl-button-group label=${titleText}>
      <sl-button href=${downloadUrl}>
        <sl-icon slot="prefix" name="filetype-pdf"></sl-icon>
        <sl-icon slot="suffix" name="download"></sl-icon>
        ${titleText}
      </sl-button>
      <sl-dropdown placement="bottom-end">
        <sl-button slot="trigger" caret>
          <sl-visually-hidden>More options</sl-visually-hidden>
        </sl-button>
        <sl-menu>
          <sl-menu-item>
            <sl-button href=${previewUrl}>
              <sl-icon slot="suffix" name="window-fullscreen"></sl-icon>
              Preview
            </sl-button>
          </sl-menu-item>
        </sl-menu>
      </sl-dropdown>
    </sl-button-group>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: PdfButton
  }
}
