import { formatDistance } from 'date-fns'
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
  private quoteChannel?: ChatSubscription
  @property()
  private pentestChannel?: ChatSubscription

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
    const {
      pathWithNamespace,
      avatar,
      namespace,
      name,
      isPentest,
      lastActivityAt,
    } = this.project

    const image = avatar || namespace.avatar

    const avatarElement = image
      ? html`<img id="avatar" src="${image}" />`
      : html`<sl-icon id="avatar" name="git"></sl-icon>`

    const now = new Date()

    const lastGitLabActivity = formatDistance(lastActivityAt, now)
    const lastQuoteActivity = this.quoteChannel
      ? html`Quote updated
        ${formatDistance(this.quoteChannel.lastUpdatedAt, now)} ago`
      : ''
    const lastPentestActivity = this.pentestChannel
      ? html`Pentest updated
        ${formatDistance(this.pentestChannel.lastUpdatedAt, now)} ago`
      : ''

    return html`
      <a href="/projects/${pathWithNamespace}">
        ${avatarElement}
        <div id="details">
          <span id="namespace"
            >${namespace.name}
            <sl-badge pill variant=${isPentest ? 'danger' : 'warning'}
              >${isPentest ? 'pentest' : 'quote'}</sl-badge
            ><sl-badge variant="neutral" pill
              >Status: ${this.project.status}</sl-badge
            ></span
          >
          <span id="name"> ${name}</span>

          <span> GitLab updated ${lastGitLabActivity} ago </span>
          <span>${lastQuoteActivity}</span>
          <span>${lastPentestActivity}</span>
        </div>
        <div id="chat">
          ${this.quoteChannel?.unread
            ? html`<sl-tooltip content="Unread messages in quote channel">
                <sl-badge variant="primary" pill
                  >${this.quoteChannel?.unread}</sl-badge
                >
              </sl-tooltip>`
            : ''}
          ${this.pentestChannel?.unread
            ? html`<sl-tooltip content="Unread messages in pentest channel">
                <sl-badge variant="danger" pill
                  >${this.pentestChannel?.unread}</sl-badge
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
