import {
  ProjectDetailsFinding,
  ProjectDetailsFindingNonFinding,
} from '../types/project-details'

export const isNonFinding = (
  finding: ProjectDetailsFinding
): finding is ProjectDetailsFindingNonFinding => {
  return Boolean(!finding.label)
}
