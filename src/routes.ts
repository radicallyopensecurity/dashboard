import { RouteConfig } from '@lit-labs/router'
import { html } from 'lit'

export const routes: RouteConfig[] = [
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
]
