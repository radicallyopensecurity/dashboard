import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

const ELEMENT_NAME = 'project-chat'

@customElement(ELEMENT_NAME)
export class ProjectChat extends LitElement {
  @property()
  private chatUrl: string | null = null

  static styles = [
    ...theme,
    css`
      sl-card::part(base) {
        min-height: 300px;
        display: flex;
        resize: vertical;
        overflow: auto;
        flex-direction: column;
      }

      sl-card::part(body) {
        display: flex;
        flex: 1;
        width: 100%;
        align-self: stretch;
      }

      section {
        display: flex;
        flex-direction: column;
        flex: 1;
      }

      secure-iframe {
        margin-top: var(--sl-spacing-x-small);
        width: 100%;
        height: 100%;
      }

      p {
        margin: 0;
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
      }
    `,
  ]

  render() {
    const { chatUrl } = this

    return html`<sl-card>
      <section>
        ${chatUrl && html`<secure-iframe .src=${chatUrl}></secure-iframe>`}
        ${!chatUrl && html`<p>Could not find chat room</p>`}
      </section>
    </sl-card>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: ProjectChat
  }
}
