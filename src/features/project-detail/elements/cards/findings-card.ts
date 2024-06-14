import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

import {
  type ProjectDetailsFinding,
  type ProjectDetailsGroupedFindings,
} from '@/modules/projects/types/project-details'

import '@/features/project-detail/elements/finding-details'

const emptyText = (type: string): string => `This project doesn't have ${type}.`

const ELEMENT_NAME = 'findings-card'

@customElement(ELEMENT_NAME)
export class FindingsCard extends LitElement {
  @property()
  private findings: ProjectDetailsGroupedFindings[] = []
  @property()
  private nonFindings: ProjectDetailsFinding[] = []
  @property()
  private projectId = 0
  @property()
  private baseUrl = ''

  static styles = [
    ...theme,
    css`
      sl-card::part(body) {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-x-large);
      }

      .findings-content {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-large);
      }

      section p {
        margin: 0;
      }

      .title-badge {
        font-size: var(--sl-font-size-x-large);
      }

      .badge-findings::part(base) {
        background: var(--sl-color-blue-400);
      }

      .badge-findings-todo::part(base) {
        background: var(--sl-color-teal-500);
      }

      .badge-findings-extreme::part(base) {
        background: var(--sl-color-danger-500);
      }

      .badge-findings-high::part(base) {
        background: var(--sl-color-orange-500);
      }

      .badge-findings-elevated::part(base) {
        background: var(--sl-color-yellow-500);
      }

      .badge-findings-moderate::part(base) {
        background: var(--sl-color-violet-500);
      }

      .badge-findings-low::part(base) {
        background: var(--sl-color-fuchsia-500);
      }

      .badge-findings-unknown::part(base) {
        background: var(--sl-color-neutral-500);
      }

      .badge-non-findings::part(base) {
        background: var(--sl-color-neutral-400);
      }

      sl-card h2,
      sl-card h3 {
        display: flex;
        gap: var(--sl-spacing-small);
        align-items: center;
        margin-bottom: var(--sl-spacing-medium);
      }
    `,
  ]

  render() {
    const { findings, nonFindings, projectId } = this

    const amountFindings = findings
      .map((x) => x.findings)
      .flatMap((x) => x.length)
      .reduce((acc, curr) => acc + curr, 0)

    return html`<sl-card>
      <section>
        <h2>
          Findings
          <sl-badge class="title-badge badge-findings"
            >${amountFindings}</sl-badge
          >
        </h2>
        <div class="findings-content">
          ${findings.length
            ? html`
                ${findings.map(
                  ({ group, findings }) => html`
                    <section>
                      <h3>
                        ${group}
                        <sl-badge
                          class="title-badge badge-findings-${group.toLocaleLowerCase()}"
                          >${findings.length}</sl-badge
                        >
                      </h3>
                      <finding-details
                        .findings=${findings}
                        .projectId=${projectId}
                        .baseUrl=${this.baseUrl}
                      ></finding-details>
                    </section>
                  `
                )}
              `
            : html`<p>${emptyText('findings')}</p>`}
        </div>
      </section>
      <section>
        <h2>
          Non-findings
          <sl-badge class="title-badge badge-non-findings"
            >${nonFindings.length}</sl-badge
          >
        </h2>

        ${nonFindings.length
          ? html`<finding-details
              .findings=${nonFindings}
              .projectId=${projectId}
              .baseUrl=${this.baseUrl}
            ></finding-details>`
          : html`<p>${emptyText('non-findings')}</p>`}
      </section>
    </sl-card> `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: FindingsCard
  }
}
