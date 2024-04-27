/* eslint-disable @typescript-eslint/no-unused-vars */
import { format } from 'date-fns'

import { type GitLabEvent } from '@/modules/gitlab/types/gitlab-event'
import { type GitLabIssue } from '@/modules/gitlab/types/gitlab-issue'
import { type GitLabLabel } from '@/modules/gitlab/types/gitlab-label'
import { type GitLabMember } from '@/modules/gitlab/types/gitlab-member'
import { type GitLabVariable } from '@/modules/gitlab/types/gitlab-variable'

import { normalizeFinding } from '@/modules/projects/normalizers/normalize-finding'
import { normalizeMember } from '@/modules/projects/normalizers/normalize-member'
import { type ProjectDetails } from '@/modules/projects/types/project-details'

import { groupByMultiple } from '@/utils/array/group-by'

import { normalizeEvent } from './normalize-event'

const FINDING_LABEL = 'finding'
const NON_FINDING_LABEL = 'non-finding'

const isEitherFinding = ({ labels }: { labels: string[] }) =>
  labels.some((label) => label === FINDING_LABEL || label === NON_FINDING_LABEL)

const isFinding = ({ labels }: { labels: string[] }) =>
  labels.some((label) => label === FINDING_LABEL)

const isNonFinding = ({ labels }: { labels: string[] }) =>
  labels.some((label) => label === NON_FINDING_LABEL)

const isHuman = (member: GitLabMember) => member.name !== 'CI'
const isStaff = (member: GitLabMember) => member.access_level >= 40
const isCustomer = (member: GitLabMember) => member.access_level < 40

export const normalizeProjectDetails = (
  id: number,
  events: GitLabEvent[],
  issues: GitLabIssue[],
  _labels: GitLabLabel[],
  members: GitLabMember[],
  _variables: GitLabVariable[]
): ProjectDetails => {
  const allFindings = issues.filter(isEitherFinding).map(normalizeFinding)
  const crew = members.filter(isHuman)

  const history = Object.entries(
    groupByMultiple((x) => format(new Date(x.created_at), 'yyyy-MM-dd'), events)
  )
    .map(([date, events]) => ({
      date,
      dateDisplay: format(new Date(date), 'eeee, dd-MM-yyyy'),
      events: events
        .map(normalizeEvent)
        .sort((a, b) => b.date.getTime() - a.date.getTime()),
    }))
    .sort((a, b) => b.date.localeCompare(a.date))

  return {
    id,
    staff: crew.filter(isStaff).map(normalizeMember),
    customers: crew.filter(isCustomer).map(normalizeMember),
    allFindings,
    findings: allFindings.filter(isFinding),
    nonFindings: allFindings.filter(isNonFinding),
    history,
  }
}
