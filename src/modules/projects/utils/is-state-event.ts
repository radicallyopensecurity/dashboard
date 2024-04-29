import type {
  ProjectDetailsEvent,
  ProjectDetailsStateEvent,
} from '@/modules/projects/types/project-details'

export const isStateEvent = (
  event: ProjectDetailsEvent
): event is ProjectDetailsEvent & ProjectDetailsStateEvent => {
  return (
    event.action === 'opened' ||
    event.action === 'closed' ||
    event.action === 'updated'
  )
}
