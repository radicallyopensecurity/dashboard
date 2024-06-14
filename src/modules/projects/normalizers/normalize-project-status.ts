import { ProjectStatus } from '../types/project'

const VALUES: ProjectStatus[] = [
  'Staffing',
  'Scoping',
  'ProposalShared',
  'ProposalAccepted',
  'ProposalRejected',
  'ProposalNoResponse',
  'ToStart',
  'Running',
  'Delivered',
  'PmClosed',
  'ReTesting',
  'Unknown',
]

export const normalizeProjectStatus = (topics: string[]): ProjectStatus => {
  const find = topics.find((x) => x.startsWith('projectStatus:'))

  if (!find) {
    return 'Unknown'
  }

  const split = find.split('projectStatus:').pop() as ProjectStatus
  return VALUES.includes(split) ? split : 'Unknown'
}
