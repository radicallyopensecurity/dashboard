import { ProjectFindingDetails } from '../types/project-findings'

import { GitLabDiscussion } from '@/api/gitlab/types/gitlab-discussion'

const TO_DO = 'ToDo'

const getTopic = (topic: string, raw: GitLabDiscussion[], baseUrl: string) => {
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
  const replaced = joined.replaceAll('(/uploads/', `(${baseUrl}/uploads/`)

  return replaced
}

export const normalizeProjectFinding = (
  raw: GitLabDiscussion[],
  projectId: number,
  issueId: number,
  baseUrl: string
): ProjectFindingDetails => {
  const recommendation = getTopic('recommendation', raw, baseUrl)
  const impact = getTopic('impact', raw, baseUrl)
  const technicalDescription = raw[0]?.notes[0]?.body ?? TO_DO

  return {
    projectId,
    issueId,
    recommendation,
    impact,
    technicalDescription,
  }
}
