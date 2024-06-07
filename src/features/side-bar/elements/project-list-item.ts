import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

import { type Project } from '@/modules/projects/types/project'

import { ChatSubscription } from '@/modules/chat/types/chat-subscription'

const ELEMENT_NAME = 'project-list-item'

@customElement(ELEMENT_NAME)
export class ProjectListItem extends LitElement {
  @property()
  private project!: Project
  @property()
  private subscription?: ChatSubscription

  static styles = [
    ...theme,
    css`
      :host {
        display: flex;

        --image-size: 32px;
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
        line-height: var(--sl-line-height-dense);
      }

      #namespace {
        font-size: var(--sl-font-size-small);
        color: var(--sl-color-gray-600);
      }

      #chat {
        margin-left: auto;
      }
    `,
  ]

  render() {
    const { pathWithNamespace, avatar, namespace, name } = this.project

    const image = avatar || namespace.avatar

    const avatarElement = image
      ? html`<img id="avatar" src="${image}" />`
      : html`<sl-icon id="avatar" name="git"></sl-icon>`

    return html`
      <a href="/projects/${pathWithNamespace}">
        ${avatarElement}
        <div id="details">
          <span id="namespace">${namespace.name}</span>
          <span id="name">${name}</span>
        </div>
        <div id="chat">
          ${this.subscription?.unread
            ? html`<sl-tooltip content="Unread messages">
                <sl-badge variant="primary" pill
                  >${this.subscription?.unread}</sl-badge
                >
              </sl-tooltip>`
            : ''}
          ${this.subscription?.mentions
            ? html`<sl-tooltip content="Unread mentions">
                <sl-badge variant="danger" pill
                  >${this.subscription?.mentions}</sl-badge
                ></sl-tooltip
              >`
            : ''}
        </div>
      </a>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: ProjectListItem
  }
}
