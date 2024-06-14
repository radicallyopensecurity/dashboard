import { config } from '@/config'

export type VersionValue = {
  text: string
  href: string
}

export const versionValues = () => {
  const result: VersionValue[] = []

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
        href: `${repositoryUrl}/releases/tag/v${version}`,
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
