import { SlDialog } from '@shoelace-style/shoelace'
import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'

import { theme } from '@/theme/theme'

import { Project } from '@/modules/projects/types/project'
import { ProjectDetails } from '@/modules/projects/types/project-details'

import { ARCHIVED_TOPIC } from '../../constants'
import { archiveProject } from '../../utils/archive-project'

import '../pdf-password-dialog'

const ELEMENT_NAME = 'title-card'

@customElement(ELEMENT_NAME)
export class TitleCard extends LitElement {
  @property()
  private project!: Project
  @property()
  private projectDetail!: ProjectDetails
  @property()
  private onClickReload!: () => void
  @property()
  private isLoading = true

  private dialogRef = createRef<SlDialog>()

  static styles = [
    ...theme,
    css`
      :host {
        --avatar-size: 128px;
      }

      section {
        display: flex;
        justify-content: space-between;
      }

      #toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: var(--sl-spacing-x-small);
        margin-top: var(--sl-spacing-x-large);
      }

      #avatar-container {
        display: flex;
        align-self: center;
        width: 128px;
        height: 100%;
      }

      #avatar {
        width: var(--avatar-size);
        height: var(--avatar-size);
        color: var(--sl-color-primary-500);
      }

      .pending-archive {
        font-size: var(--sl-font-size-x-large);
        color: var(--sl-color-gray-500);
      }
    `,
  ]

  render() {
    const { onClickReload, isLoading } = this

    const { topics, nameWithNamespace, avatar, url, quotePdf, reportPdf } =
      this.project

    const avatarElement = avatar
      ? html`<img id="avatar" src="${avatar}" />`
      : html`<sl-icon id="avatar" name="git"></sl-icon>`

    const isArchived = topics.includes(ARCHIVED_TOPIC)

    return html`<sl-card>
      <section>
        <div>
          <h2>
            ${nameWithNamespace}${isArchived
              ? html` <span class="pending-archive">(pending archival)</span>`
              : ''}
          </h2>
          <div id="toolbar">
            <sl-button
              variant="default"
              @click=${onClickReload}
              ?loading=${isLoading}
              ?disabled=${isLoading}
            >
              <sl-icon slot="suffix" name="arrow-counterclockwise"></sl-icon>
              Reload
            </sl-button>

            <sl-button variant="default" href=${url} target="_blank">
              <sl-icon slot="prefix" name="gitlab"></sl-icon>
              <sl-icon slot="suffix" name="box-arrow-up-right"></sl-icon>
              GitLab
            </sl-button>

            <sl-button variant="default" href=${quotePdf} target="_blank">
              <sl-icon slot="prefix" name="filetype-pdf"></sl-icon>
              Quote
            </sl-button>

            <sl-button variant="default" href=${reportPdf} target="_blank">
              <sl-icon slot="prefix" name="filetype-pdf"></sl-icon>
              Report
            </sl-button>

            <sl-button
              variant="warning"
              @click=${() => this.dialogRef.value?.show()}
            >
              <sl-icon slot="prefix" name="key"></sl-icon>
              PDF Password
            </sl-button>
            <sl-dialog
              id="pdf-dialog"
              ${ref(this.dialogRef)}
              label="PDF password"
              class="dialog-overview"
            >
              <pdf-password-dialog
                .projectId=${this.project.id}
                .isLoading=${isLoading}
                .password=${this.projectDetail.pdfPassword}
              ></pdf-password-dialog>
              <sl-button
                slot="footer"
                variant="primary"
                @click=${() => this.dialogRef.value?.hide()}
                >Close</sl-button
              >
            </sl-dialog>

            <sl-button
              variant=${isArchived ? 'warning' : 'danger'}
              @click=${async () => {
                await archiveProject(this.project.id, this.project.topics)
              }}
              ?loading=${isLoading}
              ?disabled=${isLoading}
            >
              ${isArchived
                ? html`<sl-icon slot="prefix" name="arrow-up-left"></sl-icon>
                    Unarchive`
                : html`<sl-icon slot="prefix" name="archive"></sl-icon>
                    Archive`}
            </sl-button>
          </div>
        </div>
        <div id="avatar-container">${avatarElement}</div>
      </section>
    </sl-card>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: TitleCard
  }
}
