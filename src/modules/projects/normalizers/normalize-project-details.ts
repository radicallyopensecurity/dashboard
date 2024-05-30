/* eslint-disable @typescript-eslint/no-unused-vars */

import type { GitLabEvent } from '@/api/gitlab/types/gitlab-event'
import type { GitLabIssue } from '@/api/gitlab/types/gitlab-issue'
import type { GitLabLabel } from '@/api/gitlab/types/gitlab-label'
import type { GitLabMember } from '@/api/gitlab/types/gitlab-member'
import type { GitLabVariable } from '@/api/gitlab/types/gitlab-variable'

import type { ProjectDetails } from '@/modules/projects/types/project-details'

import { normalizeFinding } from '@/modules/projects/normalizers/normalize-finding'
import { normalizeGroupedFindings } from '@/modules/projects/normalizers/normalize-grouped-findings'
import { normalizeHistory } from '@/modules/projects/normalizers/normalize-history'
import { normalizeMember } from '@/modules/projects/normalizers/normalize-member'
import { isNonFinding } from '@/modules/projects/utils/is-non-finding'

import { FINDING_LABEL, NON_FINDING_LABEL } from '../constants/labels'
import { PDF_PASSWORD_KEY } from '../constants/variables'
import { isFinding } from '../utils/is-finding'


const isEitherFinding = ({ labels }: { labels: string[] }) =>
  labels.some((label) => label === FINDING_LABEL || label === NON_FINDING_LABEL)

const isFindingRaw = ({ labels }: { labels: string[] }) =>
  labels.some((label) => label === FINDING_LABEL)

const isNonFindingRaw = ({ labels }: { labels: string[] }) =>
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
  variables: GitLabVariable[]
): ProjectDetails => {
  const allFindingsRaw = issues.filter(isEitherFinding)

  const findingsFindings = allFindingsRaw
    .filter(isFindingRaw)
    .map(normalizeFinding)

  const findingsNonFindings = allFindingsRaw
    .filter(isNonFindingRaw)
    .map(normalizeFinding)

  const allFindings = findingsFindings.concat(findingsNonFindings)

  const crew = members.filter(isHuman)

  const pdfPassword =
    variables.find((x) => x.key === PDF_PASSWORD_KEY)?.value ?? null

  return {
    id,
    pdfPassword,
    findings: normalizeGroupedFindings(findingsFindings.filter(isFinding)),
    history: normalizeHistory(events),
    staff: crew.filter(isStaff).map(normalizeMember),
    customers: crew.filter(isCustomer).map(normalizeMember),
    allFindings,
    nonFindings: findingsNonFindings.filter(isNonFinding),
  }
}
