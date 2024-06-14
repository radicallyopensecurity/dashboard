import {
  type ProjectDetailsFindingFinding,
  ProjectDetailsFindingLabel,
  type ProjectDetailsGroupedFindings,
} from '@/modules/projects/types/project-details'

import { groupByMultiple } from '@/utils/array/group-by'

const FINDINGS_GROUP_ORDER = [
  ProjectDetailsFindingLabel.ToDo,
  ProjectDetailsFindingLabel.Extreme,
  ProjectDetailsFindingLabel.High,
  ProjectDetailsFindingLabel.Elevated,
  ProjectDetailsFindingLabel.Moderate,
  ProjectDetailsFindingLabel.Low,
  ProjectDetailsFindingLabel.Unknown,
]

export const normalizeGroupedFindings = (
  findingsFindings: ProjectDetailsFindingFinding[]
): ProjectDetailsGroupedFindings[] => {
  const findings = (
    Object.entries(groupByMultiple((x) => x.label, findingsFindings)).map(
      ([key, values]) => ({
        group: key,
        findings: values,
      })
    ) as ProjectDetailsGroupedFindings[]
  ).sort(
    (a, b) =>
      FINDINGS_GROUP_ORDER.indexOf(a.group) -
      FINDINGS_GROUP_ORDER.indexOf(b.group)
  )

  return findings
}
