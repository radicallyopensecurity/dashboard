type GitLabPushEvent = {
  action_name: 'pushed to'
  push_data: {
    commit_count: number
    action: string
    ref_type: string
    commit_from: string
    commit_to: string
    ref: string
    commit_title: string
    ref_count: unknown
  }
}

type GitLabStateEvent = {
  action_name: 'opened' | 'closed' | 'updated'
  target_title: string
}

type GitLabCommentEvent = {
  action_name: 'commented on'
  note: {
    noteable_iid: string
  }
}

type GitLabCreateEvent = {
  action_name: 'created'
}

export type GitLabEvent = {
  id: number
  project_id: number
  action_name: string
  target_id: string
  target_iid: string
  target_type: unknown
  target_title: string
  author_id: number
  created_at: string
  author: {
    id: number
    username: string
    name: string
    state: string
    locked: boolean
    avatar_url: string
    web_url: string
  }
  author_username: string
} & (
  | GitLabPushEvent
  | GitLabStateEvent
  | GitLabCommentEvent
  | GitLabCreateEvent
)
