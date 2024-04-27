import type {
  ProjectDetailsEvent,
  StateEvent,
} from '@/modules/projects/types/project-details'

export const isStateEvent = (
  event: ProjectDetailsEvent
): event is ProjectDetailsEvent & StateEvent => {
  return (
    event.action === 'opened' ||
    event.action === 'closed' ||
    event.action === 'updated'
  )
}
