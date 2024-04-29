import {
  ProjectDetailsFinding,
  ProjectDetailsFindingFinding,
} from '../types/project-details'

export const isFinding = (
  finding: ProjectDetailsFinding
): finding is ProjectDetailsFindingFinding => {
  return Boolean(finding.label)
}
