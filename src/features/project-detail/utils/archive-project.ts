import { updateProjectQuery } from '@/modules/projects/queries/update-project-query'

import { ARCHIVED_TOPIC } from '../constants'

export const archiveProject = async (id: number, originalTopics: string[]) => {
  let topics = originalTopics
  if (topics.includes(ARCHIVED_TOPIC)) {
    topics = topics.filter((x) => x !== ARCHIVED_TOPIC)
  } else {
    topics = topics.concat([ARCHIVED_TOPIC])
  }

  await updateProjectQuery.fetch([id, { topics }])
}
