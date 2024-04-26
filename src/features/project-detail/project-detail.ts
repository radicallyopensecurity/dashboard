import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

import { type Project } from '@/modules/projects/types/project'

const ELEMENT_NAME = 'project-detail'

import '@/features/project-detail/elements/crew-card'
import '@/features/project-detail/elements/findings-card'
import '@/features/project-detail/elements/history-card'
import '@/features/project-detail/elements/project-chat'
import '@/features/project-detail/elements/recent-changes-card'
import '@/features/project-detail/elements/title-card'

@customElement(ELEMENT_NAME)
export class ProjectDetail extends LitElement {
  @property()
  private project!: Project
  @property()
  private isLoading = true

  static styles = [
    ...theme,
    css`
      :host {
        display: grid;
        grid-template-areas:
          'title title title'
          'chat chat chat'
          'changes changes crew'
          'findings findings history';
        gap: var(--sl-spacing-large);
      }

      #title {
        grid-area: title;
      }

      #chat {
        grid-area: chat;
      }

      #changes {
        grid-area: changes;
      }

      #findings {
        grid-area: findings;
      }

      #history {
        grid-area: history;
      }
    `,
  ]

  // render() {
  //   return html`
  //     <title-card-skeleton id="title"></title-card-skeleton>
  //     <project-chat-skeleton id="chat"></project-chat-skeleton>
  //   `
  // }

  render() {
    const {
      project: { nameWithNamespace, avatar, chatUrl },
      isLoading,
    } = this

    if (isLoading) {
      return html`
        <title-card-skeleton id="title"></title-card-skeleton>
        <project-chat-skeleton id="chat"></project-chat-skeleton>
      `
    }

    return html`
      <title-card
        id="title"
        .projectTitle=${nameWithNamespace}
        .avatar=${avatar}
      >
      </title-card>
      <project-chat id="chat" .chatUrl=${chatUrl}></project-chat>
      <recent-changes-card id="changes"></recent-changes-card>
      <crew-card id="crew"></crew-card>
      <findings-card id="findings"></findings-card>
      <history-card id="history"></history-card>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: ProjectDetail
  }
}
