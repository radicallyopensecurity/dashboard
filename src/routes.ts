import { RouteConfig } from '@lit-labs/router'
import { html } from 'lit'

import { projectsService } from './modules/projects/projects-service'

export enum AppRoute {
  Home = '/',
  NewProject = '/projects/new',
  ProjectDetail = '/projects/:id',
  AuthCallback = '/auth/callback',
}

export const routes: RouteConfig[] = [
  {
    path: AppRoute.Home,
    render: () => html`<home-page></home-page>`,
    enter: async () => {
      await import('@/pages/home')
      return true
    },
  },
  {
    path: AppRoute.NewProject,
    render: () => html`<project-new-page></project-new-page>`,
    enter: async () => {
      await import('@/pages/projects/new')
      return true
    },
  },
  {
    path: AppRoute.ProjectDetail,
    render: ({ id }) =>
      html`<project-detail-page .projectId=${id}></project-detail-page>`,
    enter: async ({ id }) => {
      await import('@/pages/projects/:id')
      const projectId = Number(id)
      if (!Number.isNaN(id)) {
        void projectsService.syncProjectDetails(projectId)
      }
      return true
    },
  },
  {
    path: AppRoute.AuthCallback,
    render: () => html`<auth-callback></auth-callback>`,
    enter: async () => {
      await import('@/pages/auth/callback')
      return true
    },
  },
  {
    path: '/*',
    render: () => html`<not-found-page></not-found-page>`,
  },
]
