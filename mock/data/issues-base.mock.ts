export const ISSUE_BASE = {
  project_id: 1,
  state: 'opened',
  closed_at: null,
  closed_by: null,
  milestone: null,
  assignees: [],
  author: {
    id: 1,
    username: 'user-1',
    name: 'user-1',
    state: 'active',
    locked: false,
    avatar_url: null,
    web_url: 'https://localhost/git/user-1',
  },
  type: 'ISSUE',
  assignee: null,
  user_notes_count: 0,
  merge_requests_count: 0,
  upvotes: 0,
  downvotes: 0,
  due_date: null,
  confidential: false,
  discussion_locked: null,
  issue_type: 'issue',
  web_url: 'https://localhost/git/user-1/project-1/-/issues/1',
  time_stats: {
    time_estimate: 0,
    total_time_spent: 0,
    human_time_estimate: null,
    human_total_time_spent: null,
  },
  task_completion_status: {
    count: 0,
    completed_count: 0,
  },
  has_tasks: true,
  task_status: '0 of 0 checklist items completed',
  references: {
    short: '#1',
    relative: '#1',
    full: 'user-1/project-1#9',
  },
  severity: 'UNKNOWN',
  moved_to_id: null,
  imported: false,
  imported_from: 'none',
  service_desk_reply_to: null,
}

export const buildIssue = (
  id: number,
  title: string,
  description: string,
  date: string,
  label:
    | 'non-finding'
    | 'finding'
    | 'Unknown'
    | 'Low'
    | 'Moderate'
    | 'High'
    | 'Elevated'
    | 'Extreme'
    | 'other'
) => {
  return {
    ...ISSUE_BASE,
    id,
    iid: id,
    title,
    description,
    created_at: date,
    updated_at: date,
    labels:
      label === 'non-finding'
        ? ['non-finding']
        : label === 'finding'
          ? ['finding']
          : ['finding', `threatLevel:${label}`],
  }
}
