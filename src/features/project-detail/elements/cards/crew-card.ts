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
        --avatar-size: 24px;
      }

      sl-card::part(body) {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-x-large);
      }

      p {
        margin: 0;
      }

      sl-card h2 {
        margin-bottom: var(--sl-spacing-medium);
      }

      .list {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-medium);
        margin-top: var(--sl-spacing-medium);
      }

      .item {
        display: flex;
        gap: var(--sl-spacing-x-small);
        align-items: center;
      }

      .avatar,
      .avatar::part(base) {
        width: var(--avatar-size);
        height: var(--avatar-size);
        color: var(--sl-color-neutral-500);
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
        title: 'Stakeholders',
        list: customers,
      },
    ]

    const defaultAvatar = html`<sl-icon
      class="avatar"
      name="person-circle"
    ></sl-icon>`

    const content = lists.some((x) => x.list.length > 0)
      ? html` ${lists
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
          )}`
      : html`<section>
          <h2>Staff</h2>
          <p>This project doesn't have members yet.</p>
        </section>`

    return html` <sl-card> ${content} </sl-card> `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: CrewCard
  }
}
