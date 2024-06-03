import { capitalize } from '../utils'

export const PROJECT_BASE = {
  id: 1,
  description: null,
  name: 'pen-kian-9',
  name_with_namespace: 'Playground / pen-kian-9',
  path: 'pen-kian-9',
  path_with_namespace: 'playground/pen-kian-9',
  created_at: '2024-05-30T14:29:42.697Z',
  default_branch: 'main',
  tag_list: ['offerte'],
  topics: ['offerte'],
  ssh_url_to_repo: 'git@git.staging.radical.sexy:playground/pen-kian-9.git',
  http_url_to_repo:
    'https://git.staging.radical.sexy/playground/pen-kian-9.git',
  web_url: 'https://git.staging.radical.sexy/playground/pen-kian-9',
  readme_url:
    'https://git.staging.radical.sexy/playground/pen-kian-9/-/blob/main/INDEX.md',
  forks_count: 0,
  avatar_url: null,
  star_count: 0,
  last_activity_at: '2024-05-30T14:29:42.669Z',
  namespace: {
    id: 3599,
    name: 'Playground',
    path: 'playground',
    kind: 'group',
    full_path: 'playground',
    parent_id: null,
    avatar_url: null,
    web_url: 'https://git.staging.radical.sexy/groups/playground',
  },
  repository_storage: 'default',
  _links: {
    self: 'https://git.staging.radical.sexy/api/v4/projects/1254',
    issues: 'https://git.staging.radical.sexy/api/v4/projects/1254/issues',
    repo_branches:
      'https://git.staging.radical.sexy/api/v4/projects/1254/repository/branches',
    labels: 'https://git.staging.radical.sexy/api/v4/projects/1254/labels',
    events: 'https://git.staging.radical.sexy/api/v4/projects/1254/events',
    members: 'https://git.staging.radical.sexy/api/v4/projects/1254/members',
    cluster_agents:
      'https://git.staging.radical.sexy/api/v4/projects/1254/cluster_agents',
  },
  packages_enabled: false,
  empty_repo: false,
  archived: false,
  visibility: 'private',
  resolve_outdated_diff_discussions: false,
  container_expiration_policy: {
    cadence: '1d',
    enabled: false,
    keep_n: 10,
    older_than: '90d',
    name_regex: '.*',
    name_regex_keep: null,
    next_run_at: '2024-05-31T14:29:42.705Z',
  },
  repository_object_format: 'sha1',
  issues_enabled: true,
  merge_requests_enabled: false,
  wiki_enabled: false,
  jobs_enabled: true,
  snippets_enabled: false,
  container_registry_enabled: false,
  service_desk_enabled: true,
  service_desk_address:
    'git+playground-pen-kian-9-1254-issue-@service.staging.radical.sexy',
  can_create_merge_request_in: false,
  issues_access_level: 'private',
  repository_access_level: 'enabled',
  merge_requests_access_level: 'disabled',
  forking_access_level: 'enabled',
  wiki_access_level: 'disabled',
  builds_access_level: 'enabled',
  snippets_access_level: 'disabled',
  pages_access_level: 'disabled',
  analytics_access_level: 'enabled',
  container_registry_access_level: 'disabled',
  security_and_compliance_access_level: 'private',
  releases_access_level: 'enabled',
  environments_access_level: 'enabled',
  feature_flags_access_level: 'enabled',
  infrastructure_access_level: 'enabled',
  monitor_access_level: 'enabled',
  model_experiments_access_level: 'enabled',
  model_registry_access_level: 'enabled',
  emails_disabled: false,
  emails_enabled: true,
  shared_runners_enabled: false,
  lfs_enabled: false,
  creator_id: 8,
  import_url: 'https://git.staging.radical.sexy/pentext/offerte.git',
  import_type: 'git',
  import_status: 'finished',
  open_issues_count: 0,
  description_html: '',
  updated_at: '2024-05-30T14:29:42.697Z',
  ci_default_git_depth: 20,
  ci_forward_deployment_enabled: true,
  ci_forward_deployment_rollback_allowed: true,
  ci_job_token_scope_enabled: false,
  ci_separated_caches: true,
  ci_allow_fork_pipelines_to_run_in_parent_project: true,
  build_git_strategy: 'fetch',
  keep_latest_artifact: true,
  restrict_user_defined_variables: false,
  runners_token: null,
  runner_token_expiration_interval: null,
  group_runners_enabled: true,
  auto_cancel_pending_pipelines: 'enabled',
  build_timeout: 3600,
  auto_devops_enabled: false,
  auto_devops_deploy_strategy: 'continuous',
  ci_config_path: '',
  public_jobs: true,
  shared_with_groups: [],
  only_allow_merge_if_pipeline_succeeds: false,
  allow_merge_on_skipped_pipeline: null,
  request_access_enabled: true,
  only_allow_merge_if_all_discussions_are_resolved: false,
  remove_source_branch_after_merge: true,
  printing_merge_request_link_enabled: true,
  merge_method: 'merge',
  squash_option: 'default_off',
  enforce_auth_checks_on_uploads: false,
  suggestion_commit_message: null,
  merge_commit_template: null,
  squash_commit_template: null,
  issue_branch_template: null,
  warn_about_potentially_unwanted_characters: true,
  autoclose_referenced_issues: true,
  permissions: {
    project_access: null,
    group_access: {
      access_level: 50,
      notification_level: 3,
    },
  },
}

export const buildProject = (
  id: number,
  namespace: string,
  name: string,
  type: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  namespaceObject?: any
) => {
  const pathWithNamespace = `${namespace}/${name}`
  const capitalizedNamespace = capitalize(namespace)

  return {
    ...PROJECT_BASE,
    id,
    name,
    name_with_namespace: `${capitalizedNamespace} / ${name}`,
    path: name,
    path_with_namespace: pathWithNamespace,
    tag_list: [type],
    topics: [type],
    ssh_url_to_repo: `git@localhost:${pathWithNamespace}`,
    http_url_to_repo: `https://localhost/git/${pathWithNamespace}.git`,
    web_url: `https://localhost/git/${pathWithNamespace}`,
    readme_url: `https://localhost/git/${pathWithNamespace}/-/blob/main/INDEX.md`,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    namespace: namespaceObject
      ? namespaceObject
      : {
          id: 1,
          name: capitalizedNamespace,
          path: namespace,
          kind: 'group',
          full_path: namespace,
          parent_id: null,
          avatar_url: null,
          web_url: `https://localhost/git/groups/${namespace}`,
        },
  }
}
