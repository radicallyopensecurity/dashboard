import { generatePassword } from '@/utils/string/generate-password'

import { ProjectsStore } from '../projects-store'

import { GitLabService } from '@/api/gitlab/gitlab-service'
import { AppStore } from '@/modules/app/app-store'

export const createProject =
  (service: GitLabService, projectsStore: ProjectsStore, appStore: AppStore) =>
  async (
    importUrl: string,
    path: string,
    topic: string,
    namespaceId: number
  ) => {
    projectsStore.setIsLoading(true)

    const project = await service.createProject(
      {
        import_url: importUrl,
        path,
        topics: [topic],
        namespace_id: namespaceId,
      },
      appStore.gitlabToken
    )

    const nextYear = new Date()
    nextYear.setDate(nextYear.getDate() + 365)

    const accessToken = await service.createAccessToken(
      project.id,
      {
        name: 'CI',
        scopes: ['api'],
        expiresAt: nextYear,
      },
      appStore.gitlabToken
    )

    await Promise.all([
      service.createVariable(
        project.id,
        {
          key: 'PROJECT_ACCESS_TOKEN',
          value: accessToken.token,
          protected: false,
          masked: true,
        },
        appStore.gitlabToken
      ),
      service.createVariable(
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
  }
