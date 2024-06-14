import { SignalWatcher } from '@lit-labs/preact-signals'
import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { config } from '@/config'

import { theme } from '@/theme/theme'

import { type Project } from '@/modules/projects/types/project'
import { ProjectDetails } from '@/modules/projects/types/project-details'

import '@/features/project-detail/elements/cards/crew-card'
import '@/features/project-detail/elements/cards/findings-card'
import '@/features/project-detail/elements/cards/history-card'
import '@/features/project-detail/elements/cards/project-builds'
import '@/features/project-detail/elements/cards/project-chat'
import '@/features/project-detail/elements/cards/recent-changes-card'
import '@/features/project-detail/elements/cards/title-card'

const ELEMENT_NAME = 'project-detail'

@customElement(ELEMENT_NAME)
export class ProjectDetail extends SignalWatcher(LitElement) {
  @property()
  private project!: Project
  @property()
  private projectDetail!: ProjectDetails
  @property()
  private onClickReload!: () => void
  @property()
  private isDetailsLoading = false

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
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
        gap: var(--sl-spacing-large);
      }

      #title {
        grid-area: title;
      }

      #chat {
        z-index: 10;
        grid-area: chat;
      }

      #changes {
        z-index: 10;
        grid-area: changes;
      }

      #findings {
        z-index: 10;
        grid-area: findings;
      }

      #history {
        z-index: 10;
        grid-area: history;
      }

      #crew {
        z-index: 10;
        grid-area: crew;
      }

      sl-tab-panel::part(base) {
        padding-top: 0;
      }
    `,
  ]

  render() {
    const { project, projectDetail, onClickReload } = this

    const { quoteChannel, pentestChannel, url } = project
    const {
      staff,
      customers,
      history,
      findings,
      nonFindings,
      allFindings,
      builds,
    } = projectDetail

    // #TODO: Fix grid heights when cells dont have equal height
    // probably use flex instead of grid for the columns
    const recentChanges = allFindings
      .slice()
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 7)

    const now = new Date()

    const baseUrl = `${config.services.gitlabUrl}/${project.pathWithNamespace}`

    return html`
      <title-card
        id="title"
        .project=${project}
        .projectDetail=${projectDetail}
        .onClickReload=${onClickReload}
        .isDetailsLoading=${this.isDetailsLoading}
      >
      </title-card>

      <sl-tab-group id="chat">
        <sl-tab slot="nav" panel="quote">Quote Channel</sl-tab>
        ${project.type === 'pentest'
          ? html`<sl-tab slot="nav" panel="pentest">Pentest Channel</sl-tab>`
          : ''}
        <sl-tab slot="nav" panel="builds">Builds</sl-tab>
        <sl-tab-panel name="quote">
          <project-chat .chatUrl=${quoteChannel}></project-chat>
        </sl-tab-panel>
        ${project.type === 'pentest'
          ? html` <sl-tab-panel name="pentest">
              <project-chat .chatUrl=${pentestChannel}></project-chat>
            </sl-tab-panel>`
          : ''}
        <sl-tab-panel name="builds">
          <project-builds
            .projectId=${project.id}
            .projectName=${project.name}
            .projectNamespace=${project.namespace.path}
            .builds=${builds}
          ></project-builds>
        </sl-tab-panel>
      </sl-tab-group>

      <recent-changes-card
        id="changes"
        .findings=${recentChanges}
        .now=${now}
      ></recent-changes-card>
      <crew-card id="crew" .staff=${staff} .customers=${customers}></crew-card>
      <findings-card
        id="findings"
        .count=${allFindings.length}
        .findings=${findings}
        .nonFindings=${nonFindings}
        .projectId=${project.id}
        .baseUrl=${baseUrl}
      ></findings-card>
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
