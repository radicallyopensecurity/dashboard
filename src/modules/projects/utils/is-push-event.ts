import type {
  ProjectDetailsEvent,
  PushEvent,
} from '@/modules/projects/types/project-details'

export const isPushEvent = (
  event: ProjectDetailsEvent
): event is ProjectDetailsEvent & PushEvent => {
  return event.action === 'pushed_to'
}
