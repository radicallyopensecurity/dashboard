import { format } from 'date-fns'
import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

import { ProjectBuild } from '@/modules/projects/types/project-build'

import {
  getQuotePdfUrl,
  getReportPdfUrl,
  getCsvUrl,
  getPdfPageFromName,
} from '@/modules/projects/utils/build-artifacts'

const ELEMENT_NAME = 'build-item'

@customElement(ELEMENT_NAME)
export class BuildItem extends LitElement {
  @property()
  private projectNamespace = ''
  @property()
  private projectName = ''
  @property()
  private projectId = 0
  @property()
  private build!: ProjectBuild
  @property()
  private background: 'light' | 'dark' = 'light'

  static styles = [
    ...theme,
    css`
      #wrapper {
        display: flex;
        justify-content: space-between;
        padding: var(--sl-spacing-small);
      }

      #details {
        display: flex;
        gap: var(--sl-spacing-small);
        align-items: center;
      }

      .dark {
        background: var(--sl-color-gray-100);
      }
    `,
  ]

  render() {
    const { id, status, url, createdAt } = this.build

    let badgeColor = 'neutral'
    if (status === 'success') {
      badgeColor = 'success'
    } else if (status === 'failed') {
      badgeColor = 'danger'
    }

    return html`
      <div id="wrapper" class=${this.background}>
        <div id="details">
          <span>
            <a href=${url} target="_blank">#${id}</a href> 
          </span>
          <span>
            <sl-badge variant=${badgeColor} pill>${status}</sl-badge>
          </span>
          <span>
            at ${format(createdAt, 'eeee, dd-MM-yyyy HH:mm')} 
          </span>
        </div>
        <div id="actions">

          <pdf-button
            .downloadUrl=${getQuotePdfUrl(this.projectId, id, this.projectName)}
            .previewUrl=${getPdfPageFromName(this.projectNamespace, this.projectName, id, 'quote')}
            titleText="Quote"
          ></pdf-button>

          <pdf-button
            .downloadUrl=${getReportPdfUrl(this.projectId, id, this.projectName)}
            .previewUrl=${getPdfPageFromName(this.projectNamespace, this.projectName, id, 'report')}
            titleText="Report"
          ></pdf-button>

          <sl-button
            href=${getCsvUrl(this.projectId, id, this.projectName)}
          >
            <sl-icon slot="prefix" name="filetype-csv"></sl-icon>
            <sl-icon slot="suffix" name="download"></sl-icon>
            CSV
          </sl-button>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: BuildItem
  }
}
