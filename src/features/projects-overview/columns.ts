import { ColumnDef } from '@tanstack/lit-table'
import { format, isBefore } from 'date-fns'
import { html } from 'lit'

import { ProjectWithChannelNames } from '@/modules/projects/utils/add-channel-names'

const formatDate = (date?: Date | null, defaultTo = 'TBD'): string =>
  date ? format(date, 'yyyy-MM-dd') : defaultTo

const compareDates = (
  a: Date | null | undefined,
  b: Date | null | undefined
): number => {
  if (!a) {
    return 1
  }
  if (!b) {
    return -1
  }

  return a.getTime() - b.getTime()
}

export const createColumns = (
  now = new Date()
): ColumnDef<ProjectWithChannelNames>[] => {
  return [
    {
      accessorFn: (row) => row.project.pathWithNamespace,
      header: 'Project',
      cell: ({ row }) =>
        html`<a href=${`/projects/${row.original.project.pathWithNamespace}`}
          >${row.original.project.pathWithNamespace}</a
        >`,
    },
    {
      accessorFn: (row) => row.project.type,
      header: 'Type',
      cell: ({ row }) =>
        html`<sl-badge
          pill
          variant=${row.original.project.type === 'pentest'
            ? 'danger'
            : 'warning'}
          >${row.original.project.type}</sl-badge
        >`,
    },
    {
      accessorFn: (row) => row.project.status,
      header: 'Status',
      cell: (data) => data.getValue(),
    },
    {
      accessorFn: (row) => row.project.startDate,
      header: 'Start Date',
      cell: ({ row }) => html`${formatDate(row.original.project.startDate)}`,
      sortingFn: (a, b) =>
        compareDates(
          a.original.project.startDate,
          b.original.project.startDate
        ),
    },
    {
      accessorFn: (row) => row.project.endDate,
      header: 'End Date',
      cell: ({ row }) => {
        const isBeforeNow = row.original.project.endDate
          ? isBefore(row.original.project.endDate, now)
          : false

        return html`<span class=${isBeforeNow ? 'red' : ''}
          >${formatDate(row.original.project.endDate)}</span
        >`
      },
      sortingFn: (a, b) =>
        compareDates(a.original.project.endDate, b.original.project.endDate),
    },
    {
      accessorFn: (row) => row.project.lastActivityAt,
      header: 'Last GitLab Activity',
      cell: ({ row }) =>
        html`${formatDate(row.original.project.lastActivityAt, 'Unknown')}`,
      sortingFn: (a, b) =>
        compareDates(
          a.original.project.lastActivityAt,
          b.original.project.lastActivityAt
        ),
    },
    {
      accessorFn: (row) => row.quoteChannel?.lastUpdatedAt,
      header: 'Last Quote Channel Activity',
      cell: ({ row }) =>
        html`${formatDate(
          row.original.quoteChannel?.lastUpdatedAt,
          'Unknown'
        )}`,
      sortingFn: (a, b) =>
        compareDates(
          a.original.quoteChannel?.lastUpdatedAt,
          b.original.quoteChannel?.lastUpdatedAt
        ),
    },
    {
      accessorFn: (row) => row.pentestChannel?.lastUpdatedAt,
      header: 'Last Pentest Channel Activity',
      cell: ({ row }) =>
        html`${formatDate(
          row.original.pentestChannel?.lastUpdatedAt,
          'Unknown'
        )}`,
      sortingFn: (a, b) =>
        compareDates(
          a.original.pentestChannel?.lastUpdatedAt,
          b.original.pentestChannel?.lastUpdatedAt
        ),
    },
  ]
}
