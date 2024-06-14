import {
  type ProjectDetailsEvent,
  type ProjectDetailsPushEvent,
} from '@/modules/projects/types/project-details'

export const isPushEvent = (
  event: ProjectDetailsEvent
): event is ProjectDetailsEvent & ProjectDetailsPushEvent => {
  return event.action === 'pushed to'
}
