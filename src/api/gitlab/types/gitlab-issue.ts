export type GitLabIssue = {
  id: number
  iid: number
  project_id: number
  title: string
  description: string
  state: string
  created_at: string
  updated_at: string
  closed_at: unknown
  closed_by: unknown
  labels: string[]
  milestone: unknown
  assignees: unknown[]
  author: {
    id: number
    username: string
    name: string
    state: string
    locked: boolean
    avatar_url: string
    web_url: string
  }
  type: string
  assignee: unknown
  user_notes_count: number
  merge_requests_count: number
  upvotes: number
  downvotes: number
  due_date: unknown
  confidential: boolean
  discussion_locked: unknown
  issue_type: string
  web_url: string
  time_stats: {
    time_estimate: number
    total_time_spent: number
    human_time_estimate: unknown
    human_total_time_spent: unknown
  }
  task_completion_status: {
    count: number
    completed_count: number
  }
  has_tasks: boolean
  task_status: string
  _links: {
    self: string
    notes: string
    award_emoji: string
    project: string
    closed_as_duplicate_of: unknown
  }
  references: {
    short: string
    relative: string
    full: string
  }
  severity: string
  moved_to_id: unknown
  service_desk_reply_to: unknown
}
