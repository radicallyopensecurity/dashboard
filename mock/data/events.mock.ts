import { generateEventDetails } from '../utils'

import { EVENTS_BASE } from './events-base.mock'

export const eventsMock = [
  {
    ...EVENTS_BASE,
    ...generateEventDetails(
      1,
      'opened',
      'FINDING',
      'user-1',
      '2024-04-28T23:54:52.838Z'
    ),
  },
  {
    ...EVENTS_BASE,
    ...generateEventDetails(
      2,
      'opened',
      'FINDING',
      'user-2',
      '2024-03-28T23:54:52.838Z'
    ),
  },
  {
    ...EVENTS_BASE,
    ...generateEventDetails(
      3,
      'joined',
      'FINDING',
      'user-2',
      '2024-03-24T23:54:52.838Z'
    ),
  },
  {
    ...EVENTS_BASE,
    ...generateEventDetails(
      4,
      'created',
      'FINDING',
      'user-2',
      '2024-03-22T23:54:52.838Z'
    ),
  },
]
