import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

import { PDF_PASSWORD_KEY } from '@/modules/projects/constants/variables'
import { createVariableQuery } from '@/modules/projects/queries/create-variable-query'

import { generatePassword } from '@/utils/string/generate-password'

const ELEMENT_NAME = 'pdf-password-dialog'

@customElement(ELEMENT_NAME)
export class PdfPasswordDialog extends LitElement {
  @property()
  password!: string
  @property()
  isLoading!: boolean
  @property()
  projectId!: number

  static styles = [
    ...theme,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-medium);
      }
    `,
  ]

  render() {
    if (!this.password) {
      return html`
        This project doesn't have a PDF password. Click here to generate one and
        add it to the project.
        <sl-button
          ?loading=${this.isLoading}
          ?disabled=${this.isLoading}
          @click=${async () => {
            const password = generatePassword()
            await createVariableQuery.fetch([
              this.projectId,
              {
                key: PDF_PASSWORD_KEY,
                masked: true,
                protected: true,
                value: password,
              },
            ])
          }}
        >
          Generate
        </sl-button>
      `
    }

    return html`
      Be careful storing and sharing the PDF password!
      <sl-input
        type="password"
        value=${this.password}
        password-toggle
        readonly
      ></sl-input>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: PdfPasswordDialog
  }
}
