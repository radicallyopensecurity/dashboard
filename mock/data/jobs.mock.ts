import { buildJob } from './jobs-base.mock'

export const jobsMock = [
  buildJob(1, 'success'),
  buildJob(2, 'success'),
  buildJob(3, 'running'),
  buildJob(4, 'pending'),
]
