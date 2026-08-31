import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTable } from '@gunerkaanalkim/cairn-datatable';
import { createTable } from '@gunerkaanalkim/cairn-datatable/core';
import { BASIC_COLUMNS, EMPLOYEES } from '../shared/sample-data';
import { ApiList, type ApiEntry } from '../ui/api-list';
import { CodeBlock } from '../ui/code-block';
import { DemoBlock } from '../ui/demo-block';
import { DemoPager } from '../ui/demo-pager';
import { DocsPage } from '../ui/docs-page';
import { Prose } from '../ui/prose';

const DEMO_TS = `
const table = createTable({
  data,
  columns,
  // Selection is keyed by this value. Without it the key is the array index.
  rowId: (row) => row.id,
});
`;

const DEMO_HTML = `
<cairn-data-table [table]="table" [selectable]="true" />

<p>{{ table.selectedRows().length }} selected</p>
<button (click)="table.clearSelection()">Clear</button>
<button (click)="table.setRowSelected(1, true)">Select row 1</button>
`;

@Component({
  selector: 'app-selection',
  imports: [DataTable, RouterLink, ApiList, CodeBlock, DemoBlock, DemoPager, DocsPage, Prose],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page
      eyebrow="Data"
      heading="Selection"
      lead="A set of row identities that survives paging, sorting and filtering, plus a header checkbox scoped to the visible page."
    >
      <docs-prose>
        <p>
          Setting <code>selectable</code> on the component adds a checkbox column in front of the
          data columns. The core layer does not need the component at all, the same methods drive a
          checkbox you render yourself.
        </p>
      </docs-prose>

      <docs-demo
        heading="Selection across pages"
        description="Select a few rows, move to the next page, select more, then come back. Nothing is lost."
        [ts]="demoTs"
        [html]="demoHtml"
      >
        <div class="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <span class="rounded-md bg-indigo-50 px-2.5 py-1 font-medium text-indigo-700 tabular-nums dark:bg-indigo-500/10 dark:text-indigo-300">
            {{ table.selectedRows().length }} selected
          </span>
          <button
            type="button"
            class="focus-ring rounded-md border border-zinc-200 px-3 py-1 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            (click)="table.toggleAllPageRows()"
          >
            Toggle this page
          </button>
          <button
            type="button"
            class="focus-ring rounded-md border border-zinc-200 px-3 py-1 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            (click)="selectAllFiltered()"
          >
            Select all filtered rows
          </button>
          <button
            type="button"
            class="focus-ring rounded-md border border-zinc-200 px-3 py-1 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            (click)="table.clearSelection()"
          >
            Clear
          </button>
        </div>

        <div class="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <cairn-data-table [table]="table" [selectable]="true" caption="Selection demo" />
        </div>
        <docs-pager [table]="table" [showSelection]="true" />

        @if (table.selectedRows().length > 0) {
          <p class="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            First selected: {{ table.selectedRows()[0].name }}
          </p>
        }
      </docs-demo>

      <docs-api heading="Selection API" [entries]="api" />

      <docs-prose>
        <h2>Identity is everything</h2>
        <p>
          The selection is a <code>Set</code> of row identities produced by <code>rowId</code>. The
          default identity is the array index, which means a re-sorted or replaced array keeps the
          same selected positions rather than the same selected rows. Pass a real key and this whole
          class of bug disappears.
        </p>

        <h2>Page scope versus result scope</h2>
        <ol>
          <li><code>toggleAllPageRows</code> only touches the rows currently rendered. If every one of them is already selected it deselects them, otherwise it selects them all.</li>
          <li><code>allPageRowsSelected</code> and <code>somePageRowsSelected</code> drive the header checkbox and its indeterminate state. Both are scoped to the page.</li>
          <li><code>selectedRows</code> is the opposite: it returns the source objects for every selected identity, whether or not those rows are on the page or even pass the current filter.</li>
        </ol>

        <p>
          To select everything the filters left behind, walk <code>sortedRows()</code> rather than
          <code>rows()</code>.
        </p>
      </docs-prose>

      <docs-code [code]="selectAll" lang="ts" title="Select all filtered rows" />

      <docs-prose>
        <h2>Seeding and restoring</h2>
        <p>
          <code>initialState.selection</code> takes a <code>Set</code>. When persisting it to
          <code>localStorage</code>, convert with <code>Array.from</code> and back, since a
          <code>Set</code> does not survive <code>JSON.stringify</code>. See
          <a routerLink="/state">State and persistence</a>.
        </p>
      </docs-prose>
    </docs-page>
  `,
})
export class SelectionPage {
  protected readonly demoTs = DEMO_TS;
  protected readonly demoHtml = DEMO_HTML;

  protected readonly selectAll = `
selectAllFiltered(): void {
  // sortedRows is every filtered row, not just the current page.
  for (const row of this.table.sortedRows()) {
    this.table.setRowSelected(row.id, true);
  }
}
`;

  private readonly data = signal(EMPLOYEES);
  private readonly columns = signal(BASIC_COLUMNS);

  protected readonly table = createTable({
    data: this.data,
    columns: this.columns,
    rowId: (row) => row.id,
    initialState: { pagination: { pageIndex: 0, pageSize: 6 } },
  });

  protected selectAllFiltered(): void {
    for (const row of this.table.sortedRows()) {
      this.table.setRowSelected(row.id, true);
    }
  }

  protected readonly api: readonly ApiEntry[] = [
    { name: 'selectable', type: 'boolean (component input)', defaultValue: 'false', description: 'Renders the checkbox column in cairn-data-table. The core API works without it.' },
    { name: 'selection', type: 'Signal<ReadonlySet<RowId>>', description: 'The raw set of selected row identities.' },
    { name: 'selectedRows', type: 'Signal<readonly T[]>', description: 'Source objects for every selected identity, across all pages and regardless of the active filters.' },
    { name: 'toggleRowSelection', type: '(rowId: RowId) => void', description: 'Flips one row.' },
    { name: 'setRowSelected', type: '(rowId: RowId, selected: boolean) => void', description: 'Sets one row to an explicit state. The right call inside a loop.' },
    { name: 'isRowSelected', type: '(rowId: RowId) => boolean', description: 'Reads one row. Not a signal, call it inside a template or a computed to stay reactive.' },
    { name: 'toggleAllPageRows', type: '() => void', description: 'Selects every row on the current page, or deselects them when they are already all selected.' },
    { name: 'allPageRowsSelected', type: 'Signal<boolean>', description: 'True when the current page is non empty and fully selected.' },
    { name: 'somePageRowsSelected', type: 'Signal<boolean>', description: 'True when the page is partially selected. Drives the indeterminate checkbox.' },
    { name: 'clearSelection', type: '() => void', description: 'Empties the selection.' },
  ];
}
