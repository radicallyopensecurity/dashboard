import { createContext } from '@lit/context'
import { RouteConfig, Router } from '@lit-labs/router'
import { html } from 'lit'

import { authEnsureQuery } from './modules/auth/queries/auth-ensure-query'
import { namespacesQuery } from './modules/projects/queries/namespaces-query'
import { projectDetailsQuery } from './modules/projects/queries/project-details.query'
import { projectsQuery } from './modules/projects/queries/projects-query'
import { templatesQuery } from './modules/projects/queries/templates-query'
import { userQuery } from './modules/user/queries/user-query'

export const routerContext = createContext<Router>('router')

export enum AppRoute {
  Home = '/',
  NewProject = '/projects/new',
  ProjectDetail = '/projects/:namespace/:name',
  ProjectPdf = '/projects/:namespace/:name/pdf/:job/:type',
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

      await Promise.all([
        userQuery.data ? Promise.resolve() : userQuery.fetch(),
        projectsQuery.data ? Promise.resolve() : projectsQuery.fetch(),
      ])

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
        userQuery.data ? Promise.resolve() : userQuery.fetch(),
        projectsQuery.data ? Promise.resolve() : projectsQuery.fetch(),
        namespacesQuery.fetch(),
        templatesQuery.fetch(),
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
      await import('@/pages/projects/[:namespace.:name]/index')

      if (!(await authEnsureQuery.fetch())) {
        return true
      }

      if (!name || !namespace) {
        return true
      }

      await Promise.all([
        userQuery.data ? Promise.resolve() : userQuery.fetch(),
        projectsQuery.data ? Promise.resolve() : projectsQuery.fetch(),
      ])

      const nameWithNamespace = `${namespace}/${name}`

      const project = projectsQuery.data?.allByName[nameWithNamespace]

      const projectDetailsPromise = project
        ? projectDetailsQuery.fetch([project.id])
        : Promise.resolve()

      await projectDetailsPromise
      return true
    },
  },
  {
    path: AppRoute.ProjectPdf,
    render: ({ name, namespace, job, type }) =>
      html`<project-pdf-page
        .projectName=${name}
        .projectNamespace=${namespace}
        .job=${job}
        .type=${type}
      ></project-pdf-page>`,
    enter: async ({ name, namespace }) => {
      await import('@/pages/projects/[:namespace.:name]/pdf')

      if (!(await authEnsureQuery.fetch())) {
        return true
      }

      if (!name || !namespace) {
        return true
      }

      await Promise.all([
        userQuery.data ? Promise.resolve() : userQuery.fetch(),
        projectsQuery.data ? Promise.resolve() : projectsQuery.fetch(),
      ])

      const nameWithNamespace = `${namespace}/${name}`

      const project = projectsQuery.data?.allByName[nameWithNamespace]

      if (project && projectDetailsQuery.data?.[project.id]) {
        return true
      }

      const projectDetailsPromise = project
        ? projectDetailsQuery.fetch([project.id])
        : Promise.resolve()

      await projectDetailsPromise
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
