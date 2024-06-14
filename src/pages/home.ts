import { SignalWatcher } from '@lit-labs/preact-signals'
import { html, css, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

import { pageFlex } from '@/theme/shared/page'
import { theme } from '@/theme/theme'

import { updateTitle } from '@/modules/app/utils/update-title'

import { projectsQuery } from '@/modules/projects/queries/projects-query'

import { userQuery } from '@/modules/user/queries/user-query'

import '@/features/projects-overview/projects-overview'
import '@/features/project-list-item-large/project-list-item-large'

const ELEMENT_NAME = 'home-page'

@customElement(ELEMENT_NAME)
export class HomePage extends SignalWatcher(LitElement) {
  protected firstUpdated() {
    updateTitle()
  }

  static styles = [
    ...theme,
    ...pageFlex,
    css`
      #recently-updated {
        margin-top: var(--sl-spacing-medium);
      }
    `,
  ]

  render() {
    const name = userQuery.data?.name
    const pentests = projectsQuery.data?.pentests ?? []
    const quotes = projectsQuery.data?.quotes ?? []

    const countPentestProjects = pentests.length
    const countPentestSuffix = `pentest${countPentestProjects === 1 ? '' : 's'}`

    const countQuoteProjects = quotes.length

    const all = projectsQuery.data?.all ?? []

    const byRecentlyUpdated = all
      .slice()
      .sort((a, b) => b.lastActivityAt.getTime() - a.lastActivityAt.getTime())
      .slice(0, 10)

    const now = new Date()

    return html`<sl-card>
        <h2>Hi ${name}!</h2>
        <p>
          You have access to ${countPentestProjects} ${countPentestSuffix} and
          ${countQuoteProjects} quote projects.
        </p>
      </sl-card>

      <sl-card>
        <projects-overview .projects=${all}></projects-overview>
      </sl-card>

      <sl-card>
        <h2>Recently Updated</h2>
        <div id="recently-updated">
          ${byRecentlyUpdated.map(
            (project) =>
              html`<project-list-item-large
                .project=${project}
                .now=${now}
              ></project-list-item-large>`
          )}
        </div>
      </sl-card> `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: HomePage
  }
}
