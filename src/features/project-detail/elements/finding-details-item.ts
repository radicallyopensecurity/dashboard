import { MobxLitElement } from '@adobe/lit-mobx'
import { type SlDetails } from '@shoelace-style/shoelace'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { createRef, ref, type Ref } from 'lit/directives/ref.js'
import { toJS } from 'mobx'

import { theme } from '@/theme/theme'

import { ProjectDetailsFinding } from '@/modules/projects/types/project-details'

import { projectsService } from '@/modules/projects/projects-service'
import { projectFindingsStore } from '@/modules/projects/store/project-findings-store'
import { projectFindingKey } from '@/modules/projects/utils/project-finding-key'

import { findingMarkdownHtml } from '@/features/project-detail/utils/finding-markdown-html'

import { createLogger } from '@/utils/logging/create-logger'

const ELEMENT_NAME = 'finding-details-item'

const logger = createLogger(ELEMENT_NAME)

@customElement(ELEMENT_NAME)
export class FindingDetailsItem extends MobxLitElement {
  private projectFindingsStore = projectFindingsStore
  private detailsRef: Ref<SlDetails> = createRef()

  @property()
  private finding!: ProjectDetailsFinding
  @property()
  private projectId = 0
  @property()
  private baseUrl = ''
  @state()
  private fetched = false

  public disconnectedCallback() {
    super.disconnectedCallback()
    this.detailsRef.value?.removeEventListener('sl-show', () => this.onExpand())
  }

  protected async firstUpdated() {
    const value = this.detailsRef.value

    await value?.updateComplete

    if (!value) {
      logger.debug(
        `Could not register finding details element for findings`,
        this.finding,
        this.projectId
      )
      return
    }

    value.addEventListener('sl-show', () => this.onExpand())
  }

  private onExpand() {
    if (!this.fetched) {
      void projectsService.syncProjectFinding(this.projectId, this.finding.iid)
      this.fetched = true
    }
  }

  static styles = [
    ...theme,
    css`
      sl-details::part(content) {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-large);
      }

      h3 {
        margin: 0;
      }
    `,
  ]

  render() {
    const { projectId, finding, projectFindingsStore } = this
    const { iid, title } = finding

    const details = toJS(projectFindingsStore.data)[
      projectFindingKey(projectId, iid)
    ]

    let iframe = html`error`

    if (details?.isLoading) {
      iframe = html`loading...`
    } else if (!details?.isLoading && details?.data) {
      iframe = html`<secure-iframe
        .UNSAFE_html=${findingMarkdownHtml(finding, details.data, this.baseUrl)}
      ></secure-iframe>`
    }

    return html`<sl-details
      ${ref(this.detailsRef)}
      .iid=${iid}
      .summary=${title}
    >
      ${iframe}
    </sl-details>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: FindingDetailsItem
  }
}
