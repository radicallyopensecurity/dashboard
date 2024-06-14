import {
  ColumnDef,
  getCoreRowModel,
  TableController,
  RowData,
  flexRender,
  getSortedRowModel,
} from '@tanstack/lit-table'
import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { styleMap } from 'lit/directives/style-map.js'

import { theme } from '@/theme/theme'

import './sort-caret'

const ELEMENT_NAME = 'data-table'

@customElement(ELEMENT_NAME)
export class DataTable<TData extends RowData> extends LitElement {
  private tableController = new TableController<TData>(this)

  @property()
  private columns: ColumnDef<TData, unknown>[] = []

  @property()
  private data: TData[] = []

  static styles = [
    ...theme,
    css`
      table {
        width: 100%;
      }

      .red {
        color: red;
      }

      a,
      a:link,
      a:visited,
      a:active {
        color: var(--sl-color-primary-500);
      }

      a:hover {
        color: var(--sl-color-primary-800);
      }
    `,
  ]

  protected render() {
    const table = this.tableController.table({
      columns: this.columns,
      data: this.data,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    })

    console.log(table.getState())

    return html`
      <table>
        <thead>
          ${table.getHeaderGroups().map(
            (headerGroup) => html`
              <tr>
                ${headerGroup.headers.map(
                  (header) => html`
                    <th>
                      <div
                        style=${styleMap({
                          cursor: header.column.getCanSort()
                            ? 'pointer'
                            : 'default',
                        })}
                        @click="${header.column.getToggleSortingHandler()}"
                      >
                        ${header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        <sort-caret
                          .type="${header.column.getIsSorted()}"
                        ></sort-caret>
                      </div>
                    </th>
                  `
                )}
              </tr>
            `
          )}
        </thead>
        <tbody>
          ${repeat(
            table.getRowModel().rows,
            (row) => row.id,
            (row) =>
              html` <tr>
                ${row
                  .getVisibleCells()
                  .map(
                    (cell) => html`
                      <td>
                        ${flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    `
                  )}
              </tr>`
          )}
        </tbody>
      </table>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: DataTable<unknown>
  }
}
