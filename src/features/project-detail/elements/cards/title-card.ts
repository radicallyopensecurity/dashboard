import { SignalWatcher } from '@lit-labs/preact-signals'
import { SlDialog, SlInput } from '@shoelace-style/shoelace'
import { format } from 'date-fns'
import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'

import { theme } from '@/theme/theme'

import { Project } from '@/modules/projects/types/project'
import { ProjectDetails } from '@/modules/projects/types/project-details'

import { updateDatesQuery } from '@/modules/projects/queries/update-dates-query'
import { updateProjectQuery } from '@/modules/projects/queries/update-project-query'
import { getPdfPageFromName } from '@/modules/projects/utils/build-artifacts'

import { ARCHIVED_TOPIC } from '../../constants'
import { archiveProject } from '../../utils/archive-project'

import '../pdf-password-dialog'

const ELEMENT_NAME = 'title-card'

@customElement(ELEMENT_NAME)
export class TitleCard extends SignalWatcher(LitElement) {
  private dialogRef = createRef<SlDialog>()
  private editDatesRef = createRef<SlDialog>()
  private startDateRef = createRef<SlInput>()
  private endDateRef = createRef<SlInput>()

  @property()
  public project!: Project
  @property()
  public projectDetail!: ProjectDetails
  @property()
  public onClickReload!: () => void
  @property()
  public isDetailsLoading = false

  @state()
  private startDate: Date | null = null
  @state()
  private endDate: Date | null = null

  public disconnectedCallback() {
    this.startDateRef.value?.removeEventListener('sl-change', () => {
      this.handleDateChange(this.startDateRef.value!.value, 'startDate')
    })

    this.endDateRef.value?.removeEventListener('sl-change', () => {
      this.handleDateChange(this.endDateRef.value!.value, 'endDate')
    })
  }

  protected firstUpdated(): void {
    this.startDateRef.value?.addEventListener('sl-change', () => {
      this.handleDateChange(this.startDateRef.value!.value, 'startDate')
    })

    this.endDateRef.value?.addEventListener('sl-change', () => {
      this.handleDateChange(this.endDateRef.value!.value, 'endDate')
    })
  }

  handleDateChange(value: string, type: 'startDate' | 'endDate') {
    this[type] = new Date(value)
  }

  async handleSaveDates() {
    await updateDatesQuery.fetch({
      projectId: this.project.id,
      endDate: this.endDate,
      startDate: this.startDate,
    })

    await this.editDatesRef.value?.hide()

    this.requestUpdate()
  }

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

      #dates {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-x-small);
        margin-top: var(--sl-spacing-medium);
      }
    `,
  ]

  render() {
    const { onClickReload } = this

    const { topics, nameWithNamespace, avatar, url, quotePdf, reportPdf } =
      this.project

    const avatarElement = avatar
      ? html`<img id="avatar" src="${avatar}" />`
      : html`<sl-icon id="avatar" name="git"></sl-icon>`

    const isArchived = topics.includes(ARCHIVED_TOPIC)

    const isArchivingLoading = updateProjectQuery.status === 'loading'

    const startDate = this.project.startDate
      ? format(this.project.startDate, 'yyyy-MM-dd')
      : 'TBD'
    const endDate = this.project.endDate
      ? format(this.project.endDate, 'yyyy-MM-dd')
      : 'TBD'

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
              ?loading=${this.isDetailsLoading}
              ?disabled=${this.isDetailsLoading}
              variant="default"
              @click=${onClickReload}
            >
              <sl-icon slot="suffix" name="arrow-counterclockwise"></sl-icon>
              Reload
            </sl-button>

            <sl-button variant="default" href=${url} target="_blank">
              <sl-icon slot="prefix" name="gitlab"></sl-icon>
              <sl-icon slot="suffix" name="box-arrow-up-right"></sl-icon>
              GitLab
            </sl-button>

            <pdf-button
              .downloadUrl=${quotePdf}
              .previewUrl=${getPdfPageFromName(
                this.project.namespace.path,
                this.project.name,
                'main',
                'quote'
              )}
              titleText="Quote"
            ></pdf-button>

            <pdf-button
              .downloadUrl=${reportPdf}
              .previewUrl=${getPdfPageFromName(
                this.project.namespace.path,
                this.project.name,
                'main',
                'report'
              )}
              titleText="Report"
            ></pdf-button>

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
              ?loading=${isArchivingLoading}
              ?disabled=${isArchivingLoading}
              @click=${async () => {
                await archiveProject(this.project.id, this.project.topics)
              }}
            >
              ${isArchived
                ? html`<sl-icon slot="prefix" name="arrow-up-left"></sl-icon>
                    Unarchive`
                : html`<sl-icon slot="prefix" name="archive"></sl-icon>
                    Archive`}
            </sl-button>

            <sl-button @click=${() => this.editDatesRef.value?.show()}
              >Edit Dates</sl-button
            >
            <sl-dialog
              ${ref(this.editDatesRef)}
              id="date-dialog"
              label="Edit dates"
              class="dialog-overview"
            >
              Start Date
              <sl-input
                type="date"
                ${ref(this.startDateRef)}
                value=${startDate}
                clearable
              ></sl-input>
              End Date
              <sl-input
                type="date"
                ${ref(this.endDateRef)}
                value=${endDate}
                clearable
              ></sl-input>
              <sl-button
                slot="footer"
                @click=${() => this.editDatesRef.value?.hide()}
                >Close</sl-button
              >
              <sl-button
                slot="footer"
                variant="primary"
                @click=${this.handleSaveDates}
                >Save</sl-button
              >
            </sl-dialog>
          </div>
          <div id="dates">
            <span>Start Date: ${startDate}</span>
            <span>End Date: ${endDate}</span>
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
