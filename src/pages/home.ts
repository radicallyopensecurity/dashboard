import { MobxLitElement } from '@adobe/lit-mobx'
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

import { projects } from '@/state/projects'
import { user } from '@/state/user'

import '@/components/project-list-item-large/project-list-item-large'

const ELEMENT_NAME = 'home-page'

@customElement(ELEMENT_NAME)
export class HomePage extends MobxLitElement {
  private user = user
  private projects = projects

  static styles = [
    ...theme,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-large);
      }

      sl-card {
        position: relative;
        z-index: 50;
        width: 100%;
        box-shadow: var(--sl-shadow-medium);
      }

      h2 {
        margin: 0;
        font-size: var(--sl-font-size-2x-large);
        font-weight: var(--sl-font-weight-normal);
      }

      #recently-updated {
        margin-top: var(--sl-spacing-medium);
      }
    `,
  ]

  render() {
    const { name } = this.user
    const { pentests } = this.projects

    const countPentestProjects = pentests.length
    const countSuffix = `project${countPentestProjects === 1 ? '' : 's'}`

    const byRecentlyUpdated = this.projects.all
      .slice()
      .sort((a, b) => b.lastActivityAt.getTime() - a.lastActivityAt.getTime())
      .slice(0, 10)

    const now = new Date()

    return html`<sl-card>
        <h2>ROS Dashboard</h2>

        <p>Hi ${name}!</p>

        <p>
          You have access to ${countPentestProjects} pentest ${countSuffix}.
        </p>
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
