import { buildProject } from './project-base.mock'

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const quotes = [...Array(5)].map((_, i) =>
  buildProject(i, 'main-namespace', `off-quote-${i}`, 'offerte')
)

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const pentests = [...Array(5)].map((_, i) =>
  buildProject(i + 5, 'main-namespace', `pen-report-${i}`, 'pentest')
)

export const projectsMock = [...quotes, ...pentests]
