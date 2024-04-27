import { formatDistance } from 'date-fns'
import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

import { ProjectDetailsFinding } from '@/modules/projects/types/project-details'

const ELEMENT_NAME = 'recent-changes-card'

@customElement(ELEMENT_NAME)
export class RecentChangesCard extends LitElement {
  @property()
  private findings: ProjectDetailsFinding[] = []

  @property()
  private now!: Date

  static styles = [
    ...theme,
    css`
      #findings {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-medium);
        margin-top: var(--sl-spacing-medium);
      }

      .finding {
        display: flex;
        gap: var(--sl-spacing-small);
      }

      .time {
        margin-left: auto;
      }
    `,
  ]

  render() {
    const { findings, now } = this

    return html`
      <sl-card>
        <h2>Recent Changes</h2>
        <div id="findings">
          ${findings.map(
            ({ iid, title, updatedAt }) =>
              html`<div class="finding">
                <span>#${iid}</span>
                <a href="#">${title}</a>
                <span class="time">${formatDistance(now, updatedAt)} ago</span>
              </div>`
          )}
        </div>
      </sl-card>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: RecentChangesCard
  }
}
