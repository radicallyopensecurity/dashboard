import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

import { ProjectDetailsMember } from '@/modules/projects/types/project-details'

const ELEMENT_NAME = 'crew-card'

@customElement(ELEMENT_NAME)
export class CrewCard extends LitElement {
  @property()
  private staff: ProjectDetailsMember[] = []
  @property()
  private customers: ProjectDetailsMember[] = []

  static styles = [
    ...theme,
    css`
      :host {
        --avatar-size: 20px;
      }

      sl-card::part(body) {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-x-large);
      }

      .list {
        margin-top: var(--sl-spacing-medium);
      }

      .item {
        display: flex;
        gap: var(--sl-spacing-small);
        align-items: center;
      }

      .avatar {
        width: var(--avatar-size);
        height: var(--avatar-size);
        color: var(--sl-color-primary-500);
      }
    `,
  ]

  render() {
    const { staff, customers } = this

    const lists = [
      {
        title: 'Staff',
        list: staff,
      },
      {
        title: 'Customers',
        list: customers,
      },
    ]

    const defaultAvatar = html`<sl-icon
      class="avatar"
      name="person-circle"
    ></sl-icon>`

    return html`
      <sl-card>
        ${lists
          .filter((x) => x.list.length)
          .map(
            ({ title, list }) =>
              html`<section>
                <h2>${title}</h2>
                <div class="list">
                  ${list.map(
                    ({ avatar, name, url }) => html`
                      <a class="item" href="${url}" target="__blank">
                        ${avatar
                          ? html`
                                <sl-avatar
                                  class="avatar"
                                  image="${avatar}"
                                ></sl-avatar
                              ></a>`
                          : defaultAvatar}
                        <span>${name}</span>
                      </a>
                    `
                  )}
                </div>
              </section>`
          )}
      </sl-card>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: CrewCard
  }
}
