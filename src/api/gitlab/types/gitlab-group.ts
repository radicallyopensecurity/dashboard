export interface GitLabGroup {
  id: number
  web_url: string
  name: string
  path: string
  description: string
  visibility: string
  share_with_group_lock: boolean
  require_two_factor_authentication: boolean
  two_factor_grace_period: number
  project_creation_level: string
  auto_devops_enabled: boolean | null
  subgroup_creation_level: string
  emails_disabled: boolean
  emails_enabled: boolean
  mentions_disabled: boolean | null
  lfs_enabled: boolean
  math_rendering_limits_enabled: boolean
  lock_math_rendering_limits_enabled: boolean
  default_branch: string | null
  default_branch_protection: number
  default_branch_protection_defaults: GitLabGroupDefaultBranchProtectionDefaults
  avatar_url: string | null
  request_access_enabled: boolean
  full_name: string
  full_path: string
  created_at: string
  parent_id: number | null
  organization_id: number
  shared_runners_setting: string
}

export interface GitLabGroupDefaultBranchProtectionDefaults {
  allowed_to_push: GitLabGroupDefaultBranchProtectionAllowedToPush[]
  allow_force_push: boolean
  allowed_to_merge: GitLabGroupDefaultBranchProtectionAllowedToMerge[]
}

export interface GitLabGroupDefaultBranchProtectionAllowedToPush {
  access_level: number
}

export interface GitLabGroupDefaultBranchProtectionAllowedToMerge {
  access_level: number
}
