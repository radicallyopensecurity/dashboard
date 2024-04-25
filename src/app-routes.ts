import { Router } from '@lit-labs/router'
import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

const ELEMENT_NAME = 'app-routes'

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
        width: 100%;
      }
    `,
  ]

  render() {
    return this.router.outlet()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: AppRoutes
  }
}
