import { ProjectDetailsFindingLabel } from '@/modules/projects/types/project-details'

import { NON_FINDING_LABEL } from '../constants/labels'

const PREFIX = 'threatLevel:'

export const normalizeFindingLabel = (
  labels: string[]
): ProjectDetailsFindingLabel | null => {
  if (labels.filter((x) => x === NON_FINDING_LABEL).length) {
    return null
  }

  const [threatLevelValue] = labels.filter((x) => x.startsWith(PREFIX))

  if (!threatLevelValue) {
    return ProjectDetailsFindingLabel.ToDo
  }

  const [, value] = threatLevelValue.split(PREFIX)

  switch (value) {
    case ProjectDetailsFindingLabel.Extreme.toString():
      return ProjectDetailsFindingLabel.Extreme
    case ProjectDetailsFindingLabel.High.toString():
      return ProjectDetailsFindingLabel.High
    case ProjectDetailsFindingLabel.Elevated.toString():
      return ProjectDetailsFindingLabel.Elevated
    case ProjectDetailsFindingLabel.Moderate.toString():
      return ProjectDetailsFindingLabel.Moderate
    case ProjectDetailsFindingLabel.Low.toString():
      return ProjectDetailsFindingLabel.Low
    case ProjectDetailsFindingLabel.Unknown.toString():
      return ProjectDetailsFindingLabel.Unknown
    default:
      return ProjectDetailsFindingLabel.ToDo
  }
}
