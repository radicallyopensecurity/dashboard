import { GitLabClient } from '@/api/gitlab/gitlab-client'

import { AppSignal } from '@/modules/app/signals/app-signal'

import { generatePassword } from '@/utils/string/generate-password'

import { IMPORT_URL_USERNAME } from '../constants/projects'
import { ProjectsStore } from '../store/projects-store'

export const createProject =
  (client: GitLabClient, projectsStore: ProjectsStore, appStore: AppSignal) =>
  async (
    templateUrl: string,
    path: string,
    topic: string,
    namespaceId: number
  ): Promise<string> => {
    projectsStore.setIsLoading(true)

    const importUrl = new URL(templateUrl)
    importUrl.username = IMPORT_URL_USERNAME
    importUrl.password = appStore.gitLabToken

    const project = await client.createProject({
      import_url: importUrl.toString(),
      path,
      topics: [topic],
      namespace_id: namespaceId,
    })

    const nextYear = new Date()
    nextYear.setDate(nextYear.getDate() + 365)

    const accessToken = await client.createAccessToken(project.id, {
      name: 'CI',
      scopes: ['api'],
      expires_at: nextYear,
    })

    await Promise.all([
      client.createVariable(project.id, {
        key: 'PROJECT_ACCESS_TOKEN',
        value: accessToken.token,
        protected: false,
        masked: true,
      }),
      client.createVariable(project.id, {
        key: 'PDF_PASSWORD',
        value: generatePassword(),
        protected: false,
        masked: true,
      }),
    ])

    projectsStore.setIsLoading(false)

    return project.path_with_namespace
  }
