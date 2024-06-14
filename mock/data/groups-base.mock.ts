import { capitalize } from '@/utils/string/capitalize'

const GROUPS_BASE = {
  id: 1,
  description: '',
  visibility: 'private',
  share_with_group_lock: false,
  require_two_factor_authentication: false,
  two_factor_grace_period: 48,
  project_creation_level: 'developer',
  auto_devops_enabled: null,
  subgroup_creation_level: 'maintainer',
  emails_disabled: false,
  emails_enabled: true,
  mentions_disabled: null,
  lfs_enabled: false,
  math_rendering_limits_enabled: true,
  lock_math_rendering_limits_enabled: false,
  default_branch: null,
  default_branch_protection: 2,
  default_branch_protection_defaults: {
    allowed_to_push: [
      {
        access_level: 30,
      },
    ],
    allow_force_push: true,
    allowed_to_merge: [
      {
        access_level: 30,
      },
    ],
  },
  avatar_url: null,
  request_access_enabled: true,
  created_at: '2023-06-07T10:08:53.593Z',
  parent_id: null,
  organization_id: 1,
  shared_runners_setting: 'enabled',
}

export const buildGroup = (id: number, name: string) => {
  return {
    ...GROUPS_BASE,
    id,
    web_url: `https://localhost/git/groups/${name}`,
    name: capitalize(name),
    path: name,
    full_name: capitalize(name),
    full_path: name,
  }
}
