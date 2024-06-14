export type GitLabProject = {
  id: number
  name: string
  name_with_namespace: string
  path: string
  path_with_namespace: string
  created_at: string
  default_branch: string
  ssh_url_to_repo: string
  web_url: string
  readme_url: string
  avatar_url: string
  last_activity_at: string
  archived: boolean
  updated_at: string
  namespace: {
    id: number
    name: string
    path: string
    web_url: string
    avatar_url: string | null
  }
  tag_list: string[]
  topics: string[]
  http_url_to_repo: string
}
