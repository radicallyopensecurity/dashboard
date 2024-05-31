import { GitLabDiscussion } from '@/api/gitlab/types/gitlab-discussion'

import { ProjectFindingDetails } from '../types/project-findings'

const TO_DO = 'ToDo'

const getTopic = (topic: string, raw: GitLabDiscussion[]) => {
  const issueDiscussionComments = raw.filter((comment) =>
    comment.notes[0].body.toLowerCase().startsWith(topic.toLowerCase())
  )

  if (!issueDiscussionComments?.length) {
    return TO_DO
  }

  const [, ...lines]: string[] = issueDiscussionComments[0].notes[0].body
    .split('\n')
    .filter((line: string) => !line.match(/^\s*$/)) // remove empty lines

  const joined = lines.join('\n')
  return joined
}

export const normalizeProjectFinding = (
  raw: GitLabDiscussion[],
  projectId: number,
  issueId: number
): ProjectFindingDetails => {
  const recommendation = getTopic('recommendation', raw)
  const impact = getTopic('impact', raw)
  const type = getTopic('type', raw)
  const technicalDescriptionTopic = getTopic('technical description', raw)

  const firstRaw = raw[0]?.notes[0]?.body
  const first = firstRaw?.length ? firstRaw : TO_DO

  // in case technical description is undefined try to use the first comment
  const technicalDescription =
    technicalDescriptionTopic === TO_DO ? first : technicalDescriptionTopic

  return {
    projectId,
    issueId,
    recommendation,
    impact,
    technicalDescription,
    type,
  }
}
