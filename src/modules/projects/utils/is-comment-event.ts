import type {
  CommentEvent,
  ProjectDetailsEvent,
} from '@/modules/projects/types/project-details'

export const isCommentEvent = (
  event: ProjectDetailsEvent
): event is ProjectDetailsEvent & CommentEvent => {
  return event.action === 'commented on'
}
