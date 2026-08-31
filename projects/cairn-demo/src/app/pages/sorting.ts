import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DataTable } from '@gunerkaanalkim/cairn-datatable';
import { createTable, type ColumnDef } from '@gunerkaanalkim/cairn-datatable/core';
import { EMPLOYEES, type Employee } from '../shared/sample-data';
import { ApiList, type ApiEntry } from '../ui/api-list';
import { CodeBlock } from '../ui/code-block';
import { DemoBlock } from '../ui/demo-block';
import { DemoPager } from '../ui/demo-pager';
import { DocsPage } from '../ui/docs-page';
import { Prose } from '../ui/prose';

const ROLE_ORDER = ['Owner', 'Admin', 'Editor', 'Viewer'];

const DEMO_TS = `
const ROLE_ORDER = ['Owner', 'Admin', 'Editor', 'Viewer'];

const columns: ColumnDef<Employee>[] = [
  { id: 'name', header: 'Name' },
  {
    id: 'role',
    header: 'Role',
    // Sorts by seniority instead of alphabetically.
    sortFn: (a, b) => ROLE_ORDER.indexOf(String(a)) - ROLE_ORDER.indexOf(String(b)),
  },
  { id: 'projects', header: 'Projects', align: 'end' },
  { id: 'joinedAt', header: 'Joined' },
];

const table = createTable({
  data,
  columns: signal(columns),
  rowId: (row) => row.id,
  multiSort: true,
  initialState: { sorting: [{ id: 'role', direction: 'asc' }] },
});
`;

const DEMO_HTML = `
<cairn-data-table [table]="table" />

<button (click)="sortByProjects()">
  Most projects first
</button>
<button (click)="table.clearSorting()">Clear</button>
`;

@Component({
  selector: 'app-sorting',
  imports: [DataTable, ApiList, CodeBlock, DemoBlock, DemoPager, DocsPage, Prose],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page
      eyebrow="Data"
      heading="Sorting"
      lead="Click cycling, multi column sorting with Shift, per column comparators, and a sort state you can write directly."
    >
      <docs-prose>
        <h2>The click cycle</h2>
        <ol>
          <li>First activation sorts ascending.</li>
          <li>Second activation sorts descending.</li>
          <li>Third activation removes the column from the sort.</li>
        </ol>
        <p>
          Holding <strong>Shift</strong> while clicking, or pressing <strong>Shift</strong> together
          with <strong>Enter</strong>, appends the column to the existing sort instead of replacing
          it. That additive path is only taken when <code>multiSort</code> is left at its default of
          <code>true</code>.
        </p>
      </docs-prose>

      <docs-demo
        heading="Multi column sorting with a custom comparator"
        description="Role sorts by seniority rather than alphabetically. Shift and click a second header to add it to the sort."
        [ts]="demoTs"
        [html]="demoHtml"
      >
        <div class="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            class="focus-ring rounded-md border border-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            (click)="sortByProjects()"
          >
            Most projects first
          </button>
          <button
            type="button"
            class="focus-ring rounded-md border border-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            (click)="table.toggleSort('name')"
          >
            Toggle name
          </button>
          <button
            type="button"
            class="focus-ring rounded-md border border-zinc-200 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            (click)="table.clearSorting()"
          >
            Clear sorting
          </button>
        </div>

        <div class="mb-4 rounded-lg bg-zinc-50 px-3 py-2 font-mono text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
          sorting() = {{ sortingLabel() }}
        </div>

        <div class="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <cairn-data-table [table]="table" caption="Sorting demo" />
        </div>
        <docs-pager [table]="table" />
      </docs-demo>

      <docs-api heading="Sorting API" [entries]="api" />

      <docs-prose>
        <h2>Comparator rules</h2>
        <ol>
          <li>A column level <code>sortFn</code> wins over the table level <code>sortFn</code>, which in turn wins over the built in comparator.</li>
          <li>The built in comparator subtracts two numbers and falls back to <code>localeCompare</code> on the string form of anything else.</li>
          <li>The comparator always receives the <em>raw</em> value from the accessor, never the formatted text.</li>
          <li>Return a positive, negative or zero number in ascending order. The library inverts the result for a descending sort, so a comparator never needs to know the direction.</li>
          <li><code>null</code> and <code>undefined</code> are handled before your comparator runs and always sink to the bottom, in both directions.</li>
          <li>Rows that compare equal keep their original order, because ties fall back to the source index.</li>
        </ol>
      </docs-prose>

      <docs-code [code]="comparator" lang="ts" title="Sorting a date column" />

      <docs-prose>
        <h2>Reading and writing the state</h2>
        <p>
          <code>sorting()</code> is an ordered list. The first entry is the primary sort, the rest are
          tie breakers applied in order. Writing it directly with <code>setSorting</code> is the
          simplest way to restore a saved view or to expose your own sort control.
        </p>
        <p>
          <code>setSorting</code> drops any entry that points at a column with
          <code>sortable: false</code>, so a stale saved view cannot re-enable a sort you disabled.
        </p>
      </docs-prose>
    </docs-page>
  `,
})
export class SortingPage {
  protected readonly demoTs = DEMO_TS;
  protected readonly demoHtml = DEMO_HTML;

  protected readonly comparator = `
{
  id: 'joinedAt',
  header: 'Joined',
  // The raw value is an ISO string, so a plain comparison is chronological.
  sortFn: (a, b) => String(a).localeCompare(String(b)),
  // Only the rendered text changes, the sort still sees the ISO string.
  formatter: (value) => new Date(String(value)).toLocaleDateString('en-GB'),
}
`;

  private readonly data = signal(EMPLOYEES.slice(0, 30));

  private readonly columnDefs: readonly ColumnDef<Employee>[] = [
    { id: 'name', header: 'Name' },
    {
      id: 'role',
      header: 'Role',
      sortFn: (a, b) => ROLE_ORDER.indexOf(String(a)) - ROLE_ORDER.indexOf(String(b)),
    },
    { id: 'department', header: 'Department' },
    { id: 'projects', header: 'Projects', align: 'end' },
    { id: 'joinedAt', header: 'Joined' },
  ];

  private readonly columns = signal(this.columnDefs);

  protected readonly table = createTable({
    data: this.data,
    columns: this.columns,
    rowId: (row) => row.id,
    initialState: {
      sorting: [{ id: 'role', direction: 'asc' }],
      pagination: { pageIndex: 0, pageSize: 8 },
    },
  });

  protected sortByProjects(): void {
    this.table.setSorting([{ id: 'projects', direction: 'desc' }]);
  }

  protected sortingLabel(): string {
    const sorting = this.table.sorting();
    if (sorting.length === 0) return '[]';
    return sorting.map((entry) => `${entry.id} ${entry.direction}`).join(', ');
  }

  protected readonly api: readonly ApiEntry[] = [
    { name: 'sorting', type: 'Signal<readonly SortState[]>', description: 'Ordered list of active sorts. The first entry is the primary sort.' },
    { name: 'toggleSort', type: '(columnId: string, additive?: boolean) => void', description: 'Cycles ascending, descending, unsorted. With additive true and multiSort enabled the column joins the existing sort.' },
    { name: 'setSorting', type: '(sorting: readonly SortState[]) => void', description: 'Replaces the sort state. Entries for columns with sortable false are dropped.' },
    { name: 'clearSorting', type: '() => void', description: 'Removes every sort. This is also what Escape does on a focused header button.' },
    { name: 'sortedRows', type: 'Signal<readonly Row<T>[]>', description: 'Filtered and sorted rows before pagination. Useful for exports and for select all across pages.' },
  ];
}
