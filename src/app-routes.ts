import { Router } from '@lit-labs/router'
import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { versionValues } from '@/utils/version/version-values'

const ELEMENT_NAME = 'app-routes'

const FOOTER_VALUES = versionValues()

@customElement(ELEMENT_NAME)
export class AppRoutes extends LitElement {
  private router = new Router(this, [
    {
      path: '/',
      render: () => html`<home-page></home-page>`,
      enter: async () => {
        await import('@/pages/home')
        return true
      },
    },
    {
      path: '/projects/new',
      render: () => html`<project-new-page></project-new-page>`,
      enter: async () => {
        await import('@/pages/projects/new')
        return true
      },
    },
    {
      path: '/projects/:id',
      render: ({ id }) =>
        html`<project-detail-page .projectId=${id}></project-detail-page>`,
      enter: async () => {
        await import('@/pages/projects/:id')
        return true
      },
    },
    {
      path: '/auth/callback',
      render: () => html`<auth-callback></auth-callback>`,
    },
    {
      path: '/*',
      render: () => html`<not-found-page></not-found-page>`,
    },
  ])

  static styles = [
    css`
      :host {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        overflow-y: auto;
      }

      #content {
        padding: var(--content-padding);
      }

      #version {
        padding: var(--sl-spacing-x-small);
        color: var(--sl-color-neutral-600);
        text-align: center;
        background: var(--sl-color-neutral-200);
        box-shadow: var(--sl-shadow-large);
      }

      #version a {
        margin: 0 var(--sl-spacing-x-small);
        color: var(--sl-color-neutral-600);
        text-decoration: none;
      }

      #version a:visited,
      #version a:active {
        color: var(--sl-color-neutral-600);
      }
    `,
  ]

  render() {
    const versionSection = FOOTER_VALUES
      ? html`<section id="version">
          ${FOOTER_VALUES.map(
            ({ href, text }, index) =>
              html`<a href="${href}" target="_blank">${text}</a>${index <
                FOOTER_VALUES.length - 1
                  ? ' | '
                  : ''}`
          )}
        </section>`
      : ''

    return html` <div id="content">${this.router.outlet()}</div>
      ${versionSection}`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: AppRoutes
  }
}
