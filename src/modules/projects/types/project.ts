export type ProjectStatus =
  | 'Staffing'
  | 'Scoping'
  | 'ProposalShared'
  | 'ProposalAccepted'
  | 'ProposalRejected'
  | 'ProposalNoResponse'
  | 'ToStart'
  | 'Running'
  | 'Delivered'
  | 'PmClosed'
  | 'ReTesting'
  | 'Unknown'

export type Project = {
  id: number
  status: ProjectStatus
  type: 'quote' | 'pentest'
  name: string
  nameWithNamespace: string
  path: string
  pathWithNamespace: string
  createdAt: Date
  defaultBranch: string
  ssh: string
  url: string
  readme: string
  avatar: string
  lastActivityAt: Date
  isArchived: boolean
  updatedAt: Date
  namespace: {
    id: number
    name: string
    path: string
    url: string
    avatar: string | null
  }
  tags: string[]
  topics: string[]
  isQuote: boolean
  isPentest: boolean
  quotePdf: string
  reportPdf: string
  startDate: Date | null
  endDate: Date | null
  quoteChannel: string
  pentestChannel: string
}
