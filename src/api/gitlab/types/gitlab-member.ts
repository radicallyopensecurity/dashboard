export type GitLabMember = {
  id: number
  username: string
  name: string
  state: string
  locked: boolean
  avatar_url: string | null
  web_url: string
  access_level: number
  created_at: string
  expires_at: string
}
