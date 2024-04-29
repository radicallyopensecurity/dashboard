export enum ProjectDetailsFindingLabel {
  ToDo = 'ToDo',
  Extreme = 'Extreme',
  High = 'High',
  Elevated = 'Elevated',
  Moderate = 'Moderate',
  Low = 'Low',
  Unknown = 'Unknown',
}

export type ProjectDetailsMember = {
  name: string
  avatar: string | null
  url: string
}

export type ProjectDetailsFindingBase = {
  id: number
  iid: number
  title: string
  updatedAt: Date
  url: string
  description: string
}

export type ProjectDetailsFindingFinding = ProjectDetailsFindingBase & {
  label: ProjectDetailsFindingLabel
}

export type ProjectDetailsFindingNonFinding = ProjectDetailsFindingBase & {
  label: null
}

export type ProjectDetailsFinding =
  | ProjectDetailsFindingFinding
  | ProjectDetailsFindingNonFinding

export type ProjectDetailsPushEvent = {
  action: 'pushed to'
  commitFrom: string
  commitTo: string
  commitCount: number
  commitTitle: string
}

export type ProjectDetailsStateEvent = {
  action: 'opened' | 'closed' | 'updated'
  targetTitle: string
  targetIid: string
}

export type ProjectDetailsCommentEvent = {
  action: 'commented on'
  noteId: string
  targetTitle: string
  targetIid: string
}

export type ProjectDetailsCreatedEvent = {
  action: 'created'
}

type ProjectDetailsUnknownEvent = {
  action: string
}

export type ProjectDetailsEvent = {
  date: Date
  time: string
  user: string
  userUrl: string
  avatar: string
  action: string
  path: string
} & (
  | ProjectDetailsPushEvent
  | ProjectDetailsStateEvent
  | ProjectDetailsCommentEvent
  | ProjectDetailsCreatedEvent
  | ProjectDetailsUnknownEvent
)

export type ProjectDetailsHistory = {
  date: string
  dateDisplay: string
  events: ProjectDetailsEvent[]
}

export type ProjectDetailsGroupedFindings = {
  group: ProjectDetailsFindingLabel
  findings: ProjectDetailsFindingFinding[]
}

export type ProjectDetails = {
  id: number
  staff: ProjectDetailsMember[]
  customers: ProjectDetailsMember[]
  allFindings: ProjectDetailsFinding[]
  findings: ProjectDetailsGroupedFindings[]
  nonFindings: ProjectDetailsFindingNonFinding[]
  history: ProjectDetailsHistory[]
}
