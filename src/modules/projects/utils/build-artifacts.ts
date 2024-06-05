import { config } from '@/config'

const getArtifactBaseUrl = (projectId: number, jobId: number | 'main') =>
  `${config.app.gitlabBaseUrl}/projects/${projectId}/jobs/${jobId}/artifacts`

export const getQuotePdfUrl = (
  projectId: number,
  jobId: number | 'main',
  projectName: string
) => `${getArtifactBaseUrl(projectId, jobId)}/target/offerte_${projectName}.pdf`

export const getReportPdfUrl = (
  projectId: number,
  jobId: number | 'main',
  projectName: string
) => `${getArtifactBaseUrl(projectId, jobId)}/target/report_${projectName}.pdf`

const getArtifactBaseUrlFromName = (
  namespace: string,
  name: string,
  jobId: number
) =>
  `${config.services.gitlabUrl}/${namespace}/${name}/-/jobs/${jobId}/artifacts/raw`

export const getQuotePdfUrlFromName = (
  namespace: string,
  name: string,
  jobId: number
) =>
  `${getArtifactBaseUrlFromName(namespace, name, jobId)}/target/offerte_${name}.pdf`

export const getReportPdfUrlFromName = (
  namespace: string,
  name: string,
  jobId: number
) =>
  `${getArtifactBaseUrlFromName(namespace, name, jobId)}/target/report_${name}.pdf`

export const getCsvUrl = (
  projectId: number,
  jobId: number,
  projectName: string
) => `${getArtifactBaseUrl(projectId, jobId)}/target/report_${projectName}.csv`

export const getPdfPageFromName = (
  namespace: string,
  name: string,
  jobId: number | 'main',
  type: 'quote' | 'report'
) => `/projects/${namespace}/${name}/pdf/${jobId}/${type}`
