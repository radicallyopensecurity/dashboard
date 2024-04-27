import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

import { ProjectDetailsHistory } from '@/modules/projects/types/project-details'

import { getEventIcon } from '../utils/get-event-icon'
import { getEventText } from '../utils/get-event-text'

const ELEMENT_NAME = 'history-card'

@customElement(ELEMENT_NAME)
export class HistoryCard extends LitElement {
  @property()
  private history!: ProjectDetailsHistory[]

  @property()
  private baseUrl!: string

  static styles = [
    ...theme,
    css`
      :host {
        --icon-size: 20px;
      }

      h2 {
        margin-bottom: var(--sl-spacing-medium);
      }

      .event {
        display: flex;
        gap: var(--sl-spacing-small);
        align-items: baseline;
      }

      sl-details::part(content) {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-large);
      }

      .content {
        display: flex;
        flex-direction: column;
      }

      sl-icon {
        position: relative;
        top: 8px;
        width: var(--icon-size);
        height: var(--icon-size);
      }
    `,
  ]

  render() {
    const { history, baseUrl } = this

    return html`
      <sl-card>
        <h2>History</h2>
        ${history.map(
          ({ dateDisplay, events }) => html`
            <sl-details summary="${dateDisplay}">
              ${events.map((event) => {
                const { path, userUrl, user } = event

                return html`
                  <div class="event">
                    <sl-icon name="${getEventIcon(event)}"></sl-icon>
                    <div class="content">
                      <a href="${userUrl}">${user}</a>
                      <div class="text">
                        <a href="${baseUrl}${path}" target=__blank">
                          ${getEventText(event)}
                        </a>
                    </div>
                    </div>
                  </a>
                `
              })}
            </sl-details>
          `
        )}
      </sl-card>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: HistoryCard
  }
}
