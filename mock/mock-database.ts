import { discussionsMock } from './data/discussions.mock'
import { eventsMock } from './data/events.mock'
import { groupsMock } from './data/groups.mock'
import { issuesMock } from './data/issues.mock'
import { jobsMock } from './data/jobs.mock'
import { labelsMock } from './data/labels.mock'
import { membersMock } from './data/members.mock'
import { buildProject } from './data/project-base.mock'
import { projectsMock } from './data/project.mock'
import { userMock } from './data/user.mock'
import { variablesMock } from './data/variables.mock'

const data = {
  user: userMock,
  projects: projectsMock,
  events: eventsMock,
  issues: issuesMock,
  labels: labelsMock,
  members: membersMock,
  variables: variablesMock,
  groups: groupsMock,
  discussions: discussionsMock,
  jobs: jobsMock,
}

export const mockDatabase = {
  user: () => data.user,
  events: () => data.events,
  issues: () => data.issues,
  labels: () => data.labels,
  members: () => data.members,
  variables: () => data.variables,
  groups: () => data.groups,
  discussions: (issueId: number, page: number) =>
    page === 1 ? data.discussions[issueId - 1] ?? [] : [],
  jobs: (page: number) => (page === 1 || Number.isNaN(page) ? data.jobs : []),
  projects: (page: number) =>
    page === 1 || Number.isNaN(page) ? data.projects : [],
  createProject: (name: string, namespaceId: number) => {
    const namespace = data.groups.find((x) => x.id === namespaceId)

    if (!namespace) {
      throw new Error('namespace not found')
    }

    const projectId = data.projects.reduce(
      (acc, curr) => Math.max(acc, curr.id),
      0
    )

    const project = buildProject(
      projectId + 1,
      namespace.name,
      name,
      'offerte',
      namespace
    )

    data.projects = [...data.projects, project]

    return project
  },
  updateProject: (id: number, topics: string[]) => {
    const updated = data.projects.find((x) => x.id === id)

    if (!updated) {
      throw new Error('project not found')
    }

    updated.topics = topics

    data.projects = [...data.projects.filter((x) => x.id !== id), updated]

    return updated
  },
}
