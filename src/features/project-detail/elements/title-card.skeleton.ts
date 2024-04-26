import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

const ELEMENT_NAME = 'title-card-skeleton'

@customElement(ELEMENT_NAME)
export class TitleCardSkeleton extends LitElement {
  static styles = [
    ...theme,
    css`
      :host {
      }

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
        height: 128px;
        min-width: 128px;
        width: 128px;
        border-radius: var(--sl-border-radius-medium);
      }

      #toolbar {
        margin-top: var(--sl-spacing-3x-large);
        height: 41px;
        width: 400px;
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
