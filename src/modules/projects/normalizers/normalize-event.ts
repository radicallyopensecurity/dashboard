import { format } from 'date-fns'

import { GitLabEvent } from '@/modules/gitlab/types/gitlab-event'

import { ProjectDetailsEvent } from '../types/project-details'

export const normalizeEvent = (raw: GitLabEvent): ProjectDetailsEvent => {
  const base = {
    date: new Date(raw.created_at),
    time: format(new Date(raw.created_at), 'H:mm'),
    user: raw.author.name,
    userUrl: raw.author.web_url,
    avatar: raw.author.avatar_url,
    action: raw.action_name,
    path: '/',
  }

  if (raw.action_name === 'pushed to') {
    return {
      ...base,
      action: 'pushed to',
      commitFrom: raw.push_data.commit_from,
      commitTo: raw.push_data.commit_to,
      commitCount: raw.push_data.commit_count,
      commitTitle: raw.push_data.commit_title,
      path: `/compare/${raw.push_data.commit_from}...${raw.push_data.commit_to}`,
    }
  } else if (
    raw.action_name === 'opened' ||
    raw.action_name === 'closed' ||
    raw.action_name === 'updated'
  ) {
    return {
      ...base,
      action: raw.action_name,
      targetTitle: raw.target_title,
      targetIid: raw.target_iid,
      path: `/issues/${raw.target_iid}`,
    }
  } else if (raw.action_name === 'commented on') {
    return {
      ...base,
      action: raw.action_name,
      noteId: raw.note.noteable_iid,
      targetTitle: raw.target_title,
      targetIid: raw.target_iid,
      path: `/issues/${raw.note.noteable_iid}#node_${raw.target_id}`,
    }
  } else if (raw.action_name === 'created') {
    return {
      ...base,
      action: 'created',
    }
  }

  return base
}
