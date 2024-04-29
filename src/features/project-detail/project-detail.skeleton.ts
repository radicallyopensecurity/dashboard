import { MobxLitElement } from '@adobe/lit-mobx'
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

import '@/features/project-detail/elements/cards/crew-card.skeleton'
import '@/features/project-detail/elements/cards/findings-card.skeleton'
import '@/features/project-detail/elements/cards/history-card.skeleton'
import '@/features/project-detail/elements/cards/project-chat.skeleton'
import '@/features/project-detail/elements/cards/recent-changes-card.skeleton'
import '@/features/project-detail/elements/cards/title-card.skeleton'

const ELEMENT_NAME = 'project-detail-skeleton'

@customElement(ELEMENT_NAME)
export class ProjectDetailSkeleton extends MobxLitElement {
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

  render() {
    return html`
      <title-card-skeleton id="title"></title-card-skeleton>
      <project-chat-skeleton id="chat"></project-chat-skeleton>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: ProjectDetailSkeleton
  }
}
