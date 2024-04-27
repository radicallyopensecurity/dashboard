export enum FindingSeverity {
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

export type ProjectDetailsFinding = {
  id: number
  iid: number
  title: string
  labels: string[]
  updatedAt: Date
  severity: number
}

export type PushEvent = {
  action: 'pushed_to'
  commitFrom: string
  commitTo: string
  commitCount: number
  commitTitle: string
}

export type StateEvent = {
  action: 'opened' | 'closed' | 'updated'
  targetTitle: string
  targetIid: string
}

export type CommentEvent = {
  action: 'commented on'
  noteId: string
  targetTitle: string
  targetIid: string
}

export type CreatedEvent = {
  action: 'created'
}

type UnknownEvent = {
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
} & (PushEvent | StateEvent | CommentEvent | CreatedEvent | UnknownEvent)

export type ProjectDetailsHistory = {
  date: string
  dateDisplay: string
  events: ProjectDetailsEvent[]
}

export type ProjectDetails = {
  id: number
  staff: ProjectDetailsMember[]
  customers: ProjectDetailsMember[]
  allFindings: ProjectDetailsFinding[]
  findings: ProjectDetailsFinding[]
  nonFindings: ProjectDetailsFinding[]
  history: ProjectDetailsHistory[]
}
