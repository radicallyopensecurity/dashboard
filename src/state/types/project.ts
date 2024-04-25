export type Project = {
  id: number
  name: string
  nameWithNamespace: string
  path: string
  pathWithNamespace: string
  createdAt: string // #TODO date
  defaultBranch: string
  ssh: string
  url: string
  readme: string
  avatar: string
  lastActivityAt: string // #TODO date
  isArchived: boolean
  updatedAt: string // #TODO date
  namespaceId: number
  namespace: string
  namespaceUrl: string
  namespaceAvatar: string | null
  tags: string[]
}
