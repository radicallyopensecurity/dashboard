export type GitLabDiscussion = {
  id: string
  individual_note: boolean
  notes: {
    id: number
    type: null
    body: string
    attachment: null
    author: {
      id: number
      username: string
      name: string
      state: string
      locked: boolean
      avatar_url: string | null
      web_url: string
    }
    created_at: string
    updated_at: string
    system: boolean
    noteable_id: number
    noteable_type: string
    project_id: number
    resolvable: boolean
    confidential: boolean
    internal: boolean
    noteable_iid: number
    commands_changes: unknown
  }[]
}
