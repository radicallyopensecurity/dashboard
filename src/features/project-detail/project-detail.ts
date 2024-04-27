import { MobxLitElement } from '@adobe/lit-mobx'
import { html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

import { type Project } from '@/modules/projects/types/project'
import { ProjectDetails } from '@/modules/projects/types/project-details'

import '@/features/project-detail/elements/crew-card'
import '@/features/project-detail/elements/findings-card'
import '@/features/project-detail/elements/history-card'
import '@/features/project-detail/elements/project-chat'
import '@/features/project-detail/elements/recent-changes-card'
import '@/features/project-detail/elements/title-card'

const ELEMENT_NAME = 'project-detail'
@customElement(ELEMENT_NAME)
export class ProjectDetail extends MobxLitElement {
  @property()
  private project!: Project
  @property()
  private projectDetail!: ProjectDetails

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
    const { project, projectDetail } = this

    const { nameWithNamespace, avatar, chatUrl, url } = project

    const recentChanges = projectDetail.allFindings
      .slice()
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 5)

    const { staff, customers, history } = projectDetail

    const now = new Date()

    return html`
      <title-card
        id="title"
        .projectTitle=${nameWithNamespace}
        .avatar=${avatar}
      >
      </title-card>
      <project-chat id="chat" .chatUrl=${chatUrl}></project-chat>
      <recent-changes-card
        id="changes"
        .findings=${recentChanges}
        .now=${now}
      ></recent-changes-card>
      <crew-card id="crew" .staff=${staff} .customers=${customers}></crew-card>
      <findings-card id="findings"></findings-card>
      <history-card
        id="history"
        .history=${history}
        .baseUrl=${url}
      ></history-card>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: ProjectDetail
  }
}
