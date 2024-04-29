import type {
  ProjectDetailsCreatedEvent,
  ProjectDetailsEvent,
} from '@/modules/projects/types/project-details'

export const isCreatedEvent = (
  event: ProjectDetailsEvent
): event is ProjectDetailsEvent & ProjectDetailsCreatedEvent => {
  return event.action === 'created'
}
