import  {
  type ProjectDetailsCommentEvent,
  type ProjectDetailsEvent,
} from '@/modules/projects/types/project-details'

export const isCommentEvent = (
  event: ProjectDetailsEvent
): event is ProjectDetailsEvent & ProjectDetailsCommentEvent => {
  return event.action === 'commented on'
}
