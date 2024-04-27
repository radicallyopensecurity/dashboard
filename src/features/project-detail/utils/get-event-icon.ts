import { ProjectDetailsEvent } from '@/modules/projects/types/project-details'
import { isCommentEvent } from '@/modules/projects/utils/is-comment-event'
import { isCreatedEvent } from '@/modules/projects/utils/is-created-event'
import { isPushEvent } from '@/modules/projects/utils/is-push-event'
import { isStateEvent } from '@/modules/projects/utils/is-state-event'

export const getEventIcon = (event: ProjectDetailsEvent): string => {
  let icon = 'asterisk'

  if (isPushEvent(event)) {
    icon = 'git'
  } else if (isStateEvent(event)) {
    icon = 'pen'
  } else if (isCommentEvent(event)) {
    icon = 'chat-text'
  } else if (isCreatedEvent(event)) {
    icon = 'file-earmark-plus'
  }

  return icon
}
