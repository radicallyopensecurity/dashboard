import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

const ELEMENT_NAME = 'title-card-skeleton'

@customElement(ELEMENT_NAME)
export class TitleCardSkeleton extends LitElement {
  static styles = [
    ...theme,
    css`
      header {
        display: flex;
        justify-content: space-between;
      }

      #title {
        width: 50%;
        height: 28px;
        margin: 16px 0;
      }

      #title-section {
        width: 100%;
      }

      #avatar {
        width: 128px;
        min-width: 128px;
        height: 128px;
        border-radius: var(--sl-border-radius-medium);
      }

      #toolbar {
        width: 400px;
        height: 41px;
        margin-top: var(--sl-spacing-3x-large);
      }

      #toolbar sl-skeleton {
        position: relative;
        top: 4px;
        height: 24px;
      }
    `,
  ]

  render() {
    return html`<sl-card>
      <header>
        <div id="title-section">
          <sl-skeleton id="title" effect="pulse"></sl-skeleton>
          <div id="toolbar">
            <sl-skeleton effect="pulse"></sl-skeleton>
          </div>
        </div>
        <sl-skeleton id="avatar" effect="pulse"></sl-skeleton>
      </header>
    </sl-card>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: TitleCardSkeleton
  }
}
