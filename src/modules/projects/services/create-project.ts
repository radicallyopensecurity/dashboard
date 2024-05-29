import { generatePassword } from '@/utils/string/generate-password'

import { IMPORT_URL_USERNAME } from '../constants/projects'
import { ProjectsStore } from '../projects-store'

import { GitlabClient } from '@/api/gitlab/client/gitlab-client'
import { AppStore } from '@/modules/app/app-store'

export const createProject =
  (client: GitlabClient, projectsStore: ProjectsStore, appStore: AppStore) =>
  async (
    templateUrl: string,
    path: string,
    topic: string,
    namespaceId: number
  ): Promise<string> => {
    projectsStore.setIsLoading(true)

    const importUrl = new URL(templateUrl)
    importUrl.username = IMPORT_URL_USERNAME
    importUrl.password = appStore.gitlabToken

    const project = await client.createProject(
      {
        import_url: importUrl.toString(),
        path,
        topics: [topic],
        namespace_id: namespaceId,
      },
      appStore.gitlabToken
    )

    const nextYear = new Date()
    nextYear.setDate(nextYear.getDate() + 365)

    const accessToken = await client.createAccessToken(
      project.id,
      {
        name: 'CI',
        scopes: ['api'],
        expires_at: nextYear,
      },
      appStore.gitlabToken
    )

    await Promise.all([
      client.createVariable(
        project.id,
        {
          key: 'PROJECT_ACCESS_TOKEN',
          value: accessToken.token,
          protected: false,
          masked: true,
        },
        appStore.gitlabToken
      ),
      client.createVariable(
        project.id,
        {
          key: 'PDF_PASSWORD',
          value: generatePassword(),
          protected: false,
          masked: true,
        },
        appStore.gitlabToken
      ),
    ])

    projectsStore.setIsLoading(false)

    return project.path_with_namespace
  }
