export type Project = {
  id: number
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
  isQuote: boolean
  isPentest: boolean
  chatUrl: string | null
}
