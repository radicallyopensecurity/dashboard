import { ProjectDetailsEvent } from '@/modules/projects/types/project-details'

import { isCommentEvent } from '@/modules/projects/utils/is-comment-event'
import { isCreatedEvent } from '@/modules/projects/utils/is-created-event'
import { isPushEvent } from '@/modules/projects/utils/is-push-event'
import { isStateEvent } from '@/modules/projects/utils/is-state-event'

export const getEventIcon = (event: ProjectDetailsEvent): string => {
  if (isPushEvent(event)) {
    return 'git'
  } else if (isStateEvent(event)) {
    return 'pen'
  } else if (isCommentEvent(event)) {
    return 'chat-text'
  } else if (isCreatedEvent(event)) {
    return 'file-earmark-plus'
  } else if (event.action === 'joined') {
    return 'person-add'
  } else if (event.action === 'left') {
    return 'person-dash'
  } else if (event.action === 'imported') {
    return 'box-arrow-in-down'
  }

  return 'asterisk'
}
