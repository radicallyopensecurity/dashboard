export type ProjectBuildFile = {
  type: 'report' | 'quote' | 'csv'
  url: string
}

export type ProjectBuild = {
  id: number
  url: string
  status: string
  files: ProjectBuildFile[]
  createdAt: Date
  finishedAt: Date
  user: {
    username: string
    avatar: string | null
    url: string
  }
}
