import { formatDistance } from 'date-fns'
import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

import { type Project } from '@/modules/projects/types/project'

const ELEMENT_NAME = 'project-list-item-large'

@customElement(ELEMENT_NAME)
export class ProjectListItemLarge extends LitElement {
  @property()
  private project!: Project

  @property()
  private now!: Date

  static styles = [
    ...theme,
    css`
      :host {
        --image-size: 48px;
        display: flex;
        border-collapse: collapse;
        border: 1px solid var(--sl-color-gray-200);
      }

      a {
        display: flex;
        gap: var(--sl-spacing-small);
        align-items: center;
        width: 100%;
        padding: var(--sl-spacing-x-small);
        text-decoration: none;
        cursor: pointer;
      }

      a:link,
      a:visited,
      a:active {
        color: unset;
      }

      a:hover {
        background: var(--sl-color-gray-100);
      }

      #avatar {
        width: var(--image-size);
        height: var(--image-size);
        color: var(--sl-color-primary-500);
      }

      #details {
        display: flex;
        flex-direction: column;
      }

      #name {
        font-size: var(--sl-font-size-large);
      }

      #updated {
        font-size: var(--sl-font-size-small);
        color: var(--sl-color-gray-500);
      }
    `,
  ]

  render() {
    const {
      now,
      project: { id, avatar, namespace, nameWithNamespace, updatedAt },
    } = this

    const image = avatar || namespace.avatar

    const avatarElement = image
      ? html`<img id="avatar" src="${image}" />`
      : html`<sl-icon id="avatar" name="git"></sl-icon>`

    return html`
      <a href="/projects/${id}">
        ${avatarElement}
        <div id="details">
          <span id="name">${nameWithNamespace}</span>
          <span id="updated"
            >Updated ${formatDistance(now, updatedAt)} ago</span
          >
        </div>
      </a>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: ProjectListItemLarge
  }
}
