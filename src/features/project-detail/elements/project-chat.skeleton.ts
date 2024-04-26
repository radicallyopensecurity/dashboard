import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

const ELEMENT_NAME = 'project-chat-skeleton'

const SKELETON_SIZES = [50, 45, 65, 89, 40, 50, 33, 40, 50, 70]
const SKELETON_CSS = SKELETON_SIZES.map(
  (size, index) => css`
    #chat sl-skeleton:nth-child(${index + 1}) {
      width: ${size}%;
    }
  `
)

@customElement(ELEMENT_NAME)
export class ProjectChatSkeleton extends LitElement {
  static styles = [
    ...theme,
    css`
      sl-card::part(base) {
        height: 300px;
        display: flex;
        flex-direction: row;
      }

      sl-card::part(body) {
        display: flex;
        flex: 1;
        width: 100%;
        align-self: stretch;
      }

      #chat {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    `,
    ...SKELETON_CSS,
  ]

  render() {
    return html`
      <sl-card>
        <div id="chat">
          <sl-skeleton effect="pulse"></sl-skeleton>
          <sl-skeleton effect="pulse"></sl-skeleton>
          <sl-skeleton effect="pulse"></sl-skeleton>
          <sl-skeleton effect="pulse"></sl-skeleton>
          <sl-skeleton effect="pulse"></sl-skeleton>
          <sl-skeleton effect="pulse"></sl-skeleton>
          <sl-skeleton effect="pulse"></sl-skeleton>
        </div>
      </sl-card>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: ProjectChatSkeleton
  }
}
