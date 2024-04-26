import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

import { Project } from '@/state/types/project'

const ELEMENT_NAME = 'project-list-item'

@customElement(ELEMENT_NAME)
export class ProjectListItem extends LitElement {
  @property()
  private project!: Project

  static styles = [
    ...theme,
    css`
      :host {
        --image-size: 32px;
        display: flex;
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
    `,
  ]

  render() {
    const { id, avatar, namespace, name } = this.project

    const image = avatar || namespace.avatar

    const avatarElement = image
      ? html`<img id="avatar" src="${image}" />`
      : html`<sl-icon id="avatar" name="git"></sl-icon>`

    return html`
      <a href="/projects/${id}">
        ${avatarElement}
        <div id="details">
          <span id="namespace">${namespace.name}</span>
          <span id="name">${name}</span>
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
