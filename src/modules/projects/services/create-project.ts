import { gitlabClient } from '@/api/gitlab/gitlab-client'

import { appSignal } from '@/modules/app/signals/app-signal'

import { generatePassword } from '@/utils/string/generate-password'

import { IMPORT_URL_USERNAME } from '../constants/projects'
import { normalizeProject } from '../normalizers/normalize-project'
import { Project } from '../types/project'

export const createProject = async (
  templateUrl: string,
  path: string,
  topic: string,
  namespaceId: number
): Promise<Project> => {
  const importUrl = new URL(templateUrl)
  importUrl.username = IMPORT_URL_USERNAME
  importUrl.password = appSignal.gitLabToken

  const project = await gitlabClient.createProject({
    import_url: importUrl.toString(),
    path,
    topics: [topic],
    namespace_id: namespaceId,
  })

  const nextYear = new Date()
  nextYear.setDate(nextYear.getDate() + 365)

  const accessToken = await gitlabClient.createAccessToken(project.id, {
    name: 'CI',
    scopes: ['api'],
    expires_at: nextYear,
  })

  await Promise.all([
    gitlabClient.createVariable(project.id, {
      key: 'PROJECT_ACCESS_TOKEN',
      value: accessToken.token,
      protected: false,
      masked: true,
    }),
    gitlabClient.createVariable(project.id, {
      key: 'PDF_PASSWORD',
      value: generatePassword(),
      protected: false,
      masked: true,
    }),
  ])

  let quote = null
  try {
    quote = await gitlabClient.projectFile({
      id: project.id,
      path: 'source/offerte.xml',
      branch: 'main',
    })
  } catch (err) {
    /* empty */
  }

  const normalized = normalizeProject(project, quote)
  return normalized
}
