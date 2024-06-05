export type GitLabJob = {
  commit: {
    author_email: string
    author_name: string
    created_at: string
    id: string
    message: string
    short_id: string
    title: string
  }
  coverage: string | null
  archived: boolean
  allow_failure: boolean
  created_at: string
  started_at: string
  finished_at: string
  erased_at: string | null
  duration: number
  queued_duration: number
  artifacts_file?: {
    filename: string
    size: number
  }
  artifacts: {
    file_type: string
    size: number
    filename: string
    file_format: string
  }[]
  artifacts_expire_at: string
  tag_list: string[]
  id: number
  name: string
  pipeline: {
    id: number
    project_id: number
    ref: string
    sha: string
    status: string
  }
  ref: string
  runner?: {
    id: number
    description: string
    ip_address: string | null
    active: boolean
    paused: boolean
    is_shared: boolean
    runner_type: string
    name: string | null
    online: boolean
    status: string
  }
  runner_manager?: {
    id: number
    system_id: string
    version: string
    revision: string
    platform: string
    architecture: string
    created_at: string
    contacted_at: string
    ip_address: string
    status: string
  }
  stage: string
  status: string
  failure_reason: string
  tag: boolean
  web_url: string
  project: {
    ci_job_token_scope_enabled: boolean
  }
  user: {
    id: number
    name: string
    username: string
    state: string
    avatar_url: string
    web_url: string
    created_at: string
    bio: string | null
    location: string | null
    public_email: string
    skype: string
    linkedin: string
    twitter: string
    website_url: string
    organization: string
  }
}
