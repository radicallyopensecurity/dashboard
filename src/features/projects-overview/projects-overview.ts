import { SignalWatcher } from '@lit-labs/preact-signals'
import { format } from 'date-fns'
import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'

import { theme } from '@/theme/theme'

import { Project } from '@/modules/projects/types/project'

import { addChannelNames } from '@/modules/projects/utils/add-channel-names'

import { chatSubscriptionsSignal } from '@/modules/chat/signals/chat-subscriptions-signal'

const ELEMENT_NAME = 'projects-overview'

@customElement(ELEMENT_NAME)
export class ProjectsOverview extends SignalWatcher(LitElement) {
  @property()
  projects: Project[] = []

  static styles = [
    ...theme,
    css`
      :host {
        text-align: left;
      }
    `,
  ]

  render() {
    const projectsWithChannels = addChannelNames(
      this.projects,
      chatSubscriptionsSignal.subscriptions
    )

    return html`<sl-card>
      <h2>Projects</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Last GitLab Activity</th>
            <th>Last Quote Channel Activity</th>
            <th>Last Pentest Channel Activity</th>
          </tr>
        </thead>
        <tbody>
          ${map(
            projectsWithChannels,
            ({ project, pentestChannel, quoteChannel }) =>
              html`<tr>
                <td>
                  <a href=${`/projects/${project.pathWithNamespace}`}
                    >${project.pathWithNamespace}</a
                  >
                </td>
                <td>
                  <sl-badge
                    pill
                    variant=${project.isPentest ? 'danger' : 'warning'}
                    >${project.isPentest ? 'pentest' : 'quote'}</sl-badge
                  >
                </td>
                <td>${project.status}</td>
                <td>
                  ${project.startDate
                    ? format(project.startDate, 'yyyy-MM-dd')
                    : 'TBD'}
                </td>
                <td>
                  ${project.endDate
                    ? format(project.endDate, 'yyyy-MM-dd')
                    : 'TBD'}
                </td>
                <td>${format(project.lastActivityAt, 'yyyy-MM-dd')}</td>
                <td>
                  ${quoteChannel
                    ? format(quoteChannel.lastUpdatedAt, 'yyyy-MM-dd')
                    : 'unknown'}
                </td>
                <td>
                  ${pentestChannel
                    ? format(pentestChannel.lastUpdatedAt, 'yyyy-MM-dd')
                    : 'unknown'}
                </td>
              </tr>`
          )}
        </tbody>
      </table>
    </sl-card> `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: ProjectsOverview
  }
}
