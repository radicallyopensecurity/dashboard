import { config } from '@/config'

export const versionValues = () => {
  const result: {
    text: string
    href: string
  }[] = []

  const {
    app: {
      version,
      commit,
      repositoryUrl,
      publicReportIssueUrl,
      internalReportIssueUrl,
    },
  } = config

  if (repositoryUrl) {
    result.push(
      {
        text: `version: ${version}`,
        href: `${repositoryUrl}/releases/tag/${version}`,
      },
      {
        text: `commit: ${commit}`,
        href: `${repositoryUrl}/commit/${commit}`,
      }
    )
  }

  if (publicReportIssueUrl) {
    result.push({
      text: 'report issue (public)',
      href: publicReportIssueUrl,
    })
  }

  if (internalReportIssueUrl) {
    result.push({
      text: 'report issue (internal)',
      href: internalReportIssueUrl,
    })
  }

  return result
}
