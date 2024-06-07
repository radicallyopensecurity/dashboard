import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

import { ProjectDetailsHistory } from '@/modules/projects/types/project-details'

import { getEventIcon } from '../../utils/get-event-icon'
import { getEventText } from '../../utils/get-event-text'

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
        --icon-size: 32px;
        --avatar-size: 24px;
      }

      sl-card h2 {
        margin-bottom: var(--sl-spacing-medium);
      }

      .event {
        display: flex;
        gap: var(--sl-spacing-large);
        align-items: center;
        padding-bottom: var(--sl-spacing-medium);
        border-bottom: 1px solid var(--sl-color-neutral-200);
      }

      sl-details .event:nth-child(1) {
        padding-top: var(--sl-spacing-medium);
        border-top: 1px solid var(--sl-color-neutral-200);
      }

      sl-details .event:last-child {
        padding: 0;
        border: 0;
      }

      sl-details::part(content) {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-large);
      }

      .content {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-x-small);
      }

      sl-icon.event-icon {
        width: var(--icon-size);
        height: var(--icon-size);
        color: var(--sl-color-primary-600);
      }

      .avatar,
      .avatar::part(base) {
        width: var(--avatar-size);
        height: var(--avatar-size);
        color: var(--sl-color-neutral-500);
      }

      .user-link {
        display: flex;
        gap: var(--sl-spacing-x-small);
        align-items: center;
      }

      .time {
        margin-left: auto;
      }
    `,
  ]

  render() {
    const { history, baseUrl } = this

    const defaultAvatar = html`<sl-icon
      class="avatar"
      name="person-circle"
    ></sl-icon>`

    return html`
      <sl-card>
        <h2>History</h2>
        ${history.map(
          ({ dateDisplay, events }) =>
            html` <sl-details summary="${dateDisplay}">
              ${events.map((event) => {
                const { path, userUrl, user, avatar, time } = event
                return html`
                  <div class="event">
                    <sl-icon
                      class="event-icon"
                      name="${getEventIcon(event)}"
                    ></sl-icon>
                    <div class="content">
                      <a class="user-link" href="${userUrl}">
                        ${avatar
                          ? html`
                              <sl-avatar
                                class="avatar"
                                image="${avatar}"
                              ></sl-avatar
                            ></a>`
                          : defaultAvatar}
                        ${user}
                      </a>
                      <div class="text">
                        <a href=${`${baseUrl}${path}`} target="_blank">
                          ${getEventText(event)}
                        </a>
                      </div>
                    </div>
                    <span class="time">${time}</span>
                  </div>
                `
              })}
            </sl-details>`
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
