import { capitalCaseToSpaceCase } from '@/utils/string/capital-case-to-space-case'

import { ProjectStatus } from '../types/project'

const QUOTE_PROJECT_STATUSES: ProjectStatus[] = [
  'Staffing',
  'Scoping',
  'ProposalShared',
  'ProposalAccepted',
  'ProposalRejected',
  'ProposalNoResponse',
]

export const QUOTE_STATUSES = QUOTE_PROJECT_STATUSES.map((status) => ({
  value: status,
  label: capitalCaseToSpaceCase(status),
}))

const PENTEST_PROJECT_STATUSES: ProjectStatus[] = [
  'Running',
  'Delivered',
  'PmClosed',
  'ReTesting',
]

export const PENTEST_STATUSES = PENTEST_PROJECT_STATUSES.map((status) => ({
  value: status,
  label: capitalCaseToSpaceCase(status),
}))

const VALUES: ProjectStatus[] = [
  ...QUOTE_PROJECT_STATUSES,
  ...PENTEST_PROJECT_STATUSES,
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
