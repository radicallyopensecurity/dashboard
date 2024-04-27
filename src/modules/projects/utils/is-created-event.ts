import type {
  CreatedEvent,
  ProjectDetailsEvent,
} from '@/modules/projects/types/project-details'

export const isCreatedEvent = (
  event: ProjectDetailsEvent
): event is ProjectDetailsEvent & CreatedEvent => {
  return event.action === 'created'
}
