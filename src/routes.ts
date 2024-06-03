import { createContext } from '@lit/context'
import { RouteConfig, Router } from '@lit-labs/router'
import { html } from 'lit'
import { toJS } from 'mobx'

import { authEnsureQuery } from './modules/auth/queries/auth-ensure-query'
import { projectsService } from './modules/projects/projects-service'
import { projects } from './modules/projects/store/projects-store'
import { userQuery } from './modules/user/queries/user-query'

export const routerContext = createContext<Router>('router')

export enum AppRoute {
  Home = '/',
  NewProject = '/projects/new',
  ProjectDetail = '/projects/:namespace/:name',
  AuthCallback = '/auth/callback',
}

export const routes: RouteConfig[] = [
  {
    path: AppRoute.Home,
    render: () => html`<home-page></home-page>`,
    enter: async () => {
      await import('@/pages/home')
      if (!(await authEnsureQuery.fetch())) {
        return true
      }

      await Promise.all([userQuery.fetch(), projectsService.syncProjects()])

      return true
    },
  },
  {
    path: AppRoute.NewProject,
    render: () => html`<project-new-page></project-new-page>`,
    enter: async () => {
      await import('@/pages/projects/new')

      if (!(await authEnsureQuery.fetch())) {
        return true
      }

      await Promise.all([
        userQuery.fetch(),
        projectsService.syncNamespaces(),
        projectsService.syncTemplates(),
        projectsService.syncProjects(),
      ])
      return true
    },
  },
  {
    path: AppRoute.ProjectDetail,
    render: ({ name, namespace }) =>
      html`<project-detail-page
        .projectName=${name}
        .projectNamespace=${namespace}
      ></project-detail-page>`,
    enter: async ({ name, namespace }) => {
      await import('@/pages/projects/:namespace,:name')

      if (!(await authEnsureQuery.fetch())) {
        return true
      }

      if (!name || !namespace) {
        return true
      }

      await Promise.all([userQuery.fetch(), projectsService.syncProjects()])

      const nameWithNamespace = `${namespace}/${name}`

      const project = toJS(projects.allByName)[nameWithNamespace]

      if (!project) {
        return true
      }

      await projectsService.syncProjectDetails(project.id)

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
