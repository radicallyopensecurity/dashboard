import {
  GITLAB_PROJECT_PATH_PATTERN,
  ROS_NAMESPACE,
} from '@/constants/projects'

export const getChannelName = (
  namespacePath: string,
  projectPathWithNamespace: string
) => {
  const match = projectPathWithNamespace.match(GITLAB_PROJECT_PATH_PATTERN)

  if (!match?.groups) {
    return null
  }

  const {
    groups: { prefix },
  } = match

  if (namespacePath === ROS_NAMESPACE) {
    return `${prefix}-${match.groups.name}`
  } else {
    return `${namespacePath}-${prefix}-${match.groups.name}`
  }
}
