import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

const ELEMENT_NAME = 'title-card'

@customElement(ELEMENT_NAME)
export class TitleCard extends LitElement {
  @property()
  private projectTitle = ''
  @property()
  private avatar = ''

  static styles = [
    ...theme,
    css`
      :host {
        --avatar-size: 128px;
      }

      section {
        display: flex;
        justify-content: space-between;
      }

      #toolbar {
        margin-top: var(--sl-spacing-x-large);
        display: flex;
        gap: var(--sl-spacing-x-small);
        flex-wrap: wrap;
      }

      #avatar-container {
        display: flex;
        align-self: center;
        width: 128px;
        height: 100%;
      }

      #avatar {
        width: var(--avatar-size);
        height: var(--avatar-size);
        color: var(--sl-color-primary-500);
      }
    `,
  ]

  render() {
    const { projectTitle: title, avatar } = this

    const avatarElement = avatar
      ? html`<img id="avatar" src="${avatar}" />`
      : html`<sl-icon id="avatar" name="git"></sl-icon>`

    return html`<sl-card>
      <section>
        <div>
          <h2>${title}</h2>
          <div id="toolbar">
            <sl-button variant="default">
              <sl-icon slot="prefix" name="gitlab"></sl-icon>
              <sl-icon slot="suffix" name="box-arrow-up-right"></sl-icon>
              GitLab
            </sl-button>
            <sl-button variant="default">
              <sl-icon slot="prefix" name="filetype-pdf"></sl-icon>
              Quote
            </sl-button>
            <sl-button variant="default">
              <sl-icon slot="prefix" name="filetype-pdf"></sl-icon>
              Report
            </sl-button>
            <sl-button variant="warning">
              <sl-icon slot="prefix" name="key"></sl-icon>
              PDF Password
            </sl-button>
            <sl-button variant="danger">
              <sl-icon slot="prefix" name="archive"></sl-icon>
              Archive
            </sl-button>
          </div>
        </div>
        <div id="avatar-container">${avatarElement}</div>
      </section>
    </sl-card>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: TitleCard
  }
}
