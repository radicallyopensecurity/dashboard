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
        display: flex;
        flex-direction: column;
        min-height: 300px;
        overflow: auto;
        resize: vertical;
      }

      sl-card::part(body) {
        display: flex;
        flex: 1;
        align-self: stretch;
        width: 100%;
      }

      section {
        display: flex;
        flex: 1;
        flex-direction: column;
      }

      secure-iframe {
        width: 100%;
        height: 100%;
      }

      p {
        display: flex;
        flex: 1;
        gap: var(--sl-spacing-x-small);
        align-items: center;
        justify-content: center;
        margin: 0;
      }

      p sl-icon {
        position: relative;
        bottom: 2px;
      }
    `,
  ]

  render() {
    const { chatUrl } = this

    return html`<sl-card>
      <section>
        <iframe
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          referrerpolicy="origin"
          style="width:100%; height: 100%; border: 0;"
          src=${chatUrl}
        ></iframe>
      </section>
    </sl-card>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: ProjectChat
  }
}
