import { TemplateResult, html } from 'lit'

import { ProjectDetailsEvent } from '@/modules/projects/types/project-details'
import { isCommentEvent } from '@/modules/projects/utils/is-comment-event'
import { isCreatedEvent } from '@/modules/projects/utils/is-created-event'
import { isPushEvent } from '@/modules/projects/utils/is-push-event'
import { isStateEvent } from '@/modules/projects/utils/is-state-event'

export const getEventText = (event: ProjectDetailsEvent): TemplateResult<1> => {
  let content = html`${event.action}`

  if (isPushEvent(event)) {
    content = html`pushed ${event.commitCount}`
  } else if (isStateEvent(event)) {
    content = html`${event.action}
      <strong>#${event.targetIid}</strong> ${event.targetTitle} `
  } else if (isCommentEvent(event)) {
    content = html`${event.action} ${event.targetTitle} (#${event.targetIid}) `
  } else if (isCreatedEvent(event)) {
    content = html`created the project`
  }

  return content
}
