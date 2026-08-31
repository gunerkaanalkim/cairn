import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTable } from '@gunerkaanalkim/cairn-datatable';
import { createTable } from '@gunerkaanalkim/cairn-datatable/core';
import { BASIC_COLUMNS, EMPLOYEES, type Employee } from '../shared/sample-data';
import { ApiList, type ApiEntry } from '../ui/api-list';
import { DemoBlock } from '../ui/demo-block';
import { DocsPage } from '../ui/docs-page';
import { Prose } from '../ui/prose';

interface PageResult {
  readonly rows: readonly Employee[];
  readonly total: number;
}

/** Stands in for an HTTP endpoint, latency included. */
function fetchPage(
  query: string,
  sortId: string | undefined,
  direction: 'asc' | 'desc' | undefined,
  pageIndex: number,
  pageSize: number
): Promise<PageResult> {
  const lowered = query.trim().toLowerCase();
  let rows = EMPLOYEES.filter(
    (row) =>
      !lowered ||
      row.name.toLowerCase().includes(lowered) ||
      row.email.toLowerCase().includes(lowered) ||
      row.department.toLowerCase().includes(lowered)
  );

  if (sortId) {
    const factor = direction === 'desc' ? -1 : 1;
    rows = [...rows].sort(
      (a, b) => factor * String(a[sortId as keyof Employee]).localeCompare(String(b[sortId as keyof Employee]))
    );
  }

  const start = pageIndex * pageSize;
  return new Promise((resolve) =>
    setTimeout(() => resolve({ rows: rows.slice(start, start + pageSize), total: rows.length }), 350)
  );
}

@Component({
  selector: 'app-server-side',
  imports: [DataTable, RouterLink, ApiList, DemoBlock, DocsPage, Prose],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page
      eyebrow="Advanced"
      heading="Server side data"
      lead="Switch off the pipeline stages the server owns. The table keeps tracking the state, it simply stops applying it."
    >
      <docs-prose>
        <p>
          The <code>manual</code> option takes three independent flags. Turning one on means the
          matching stage passes the rows through untouched, while the state signal behind it keeps
          working normally. That is exactly what you want: the state becomes the description of the
          request you need to send.
        </p>
      </docs-prose>

      <docs-demo
        heading="A table backed by a fake endpoint"
        description="Filtering, sorting and paging all round trip through a promise with 350 ms of latency. The row count comes from the response, not from the table."
        [ts]="demoTs"
      >
        <div class="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <input
            type="search"
            placeholder="Search on the server"
            class="focus-ring rounded-md border border-zinc-200 bg-white px-3 py-1.5 dark:border-zinc-700 dark:bg-zinc-900"
            (input)="table.setGlobalFilter($any($event.target).value)"
          />
          <span class="tabular-nums text-zinc-500 dark:text-zinc-400">
            {{ total() }} rows on the server
          </span>
          @if (loading()) {
            <span class="text-indigo-600 dark:text-indigo-400">Loading…</span>
          }
        </div>

        <div class="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <cairn-data-table [table]="table" [loading]="loading()" caption="Server side demo" />
        </div>

        <div class="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <button
            type="button"
            class="focus-ring rounded-md border border-zinc-200 px-2.5 py-1 disabled:opacity-40 hover:enabled:bg-zinc-100 dark:border-zinc-700 dark:hover:enabled:bg-zinc-800"
            [disabled]="table.pagination().pageIndex === 0"
            (click)="table.previousPage()"
          >
            Previous
          </button>
          <span class="tabular-nums text-zinc-600 dark:text-zinc-400">
            Page {{ table.pagination().pageIndex + 1 }} of {{ serverPageCount() }}
          </span>
          <button
            type="button"
            class="focus-ring rounded-md border border-zinc-200 px-2.5 py-1 disabled:opacity-40 hover:enabled:bg-zinc-100 dark:border-zinc-700 dark:hover:enabled:bg-zinc-800"
            [disabled]="table.pagination().pageIndex >= serverPageCount() - 1"
            (click)="table.nextPage()"
          >
            Next
          </button>
        </div>
      </docs-demo>

      <docs-api heading="Manual mode" [entries]="api" />

      <docs-prose>
        <h2>The one thing to watch</h2>
        <p>
          <code>pageCount()</code> and <code>filteredRowCount()</code> are derived from the rows you
          hand the table. Under manual pagination that is a single page, so both report the page, not
          the result set. Keep the server's total in your own signal and drive the pager from it, as
          the demo above does.
        </p>
        <p>
          The same applies to <code>previousPage</code>, <code>nextPage</code> and
          <code>lastPage</code>: they clamp against the table's idea of the page count. With manual
          pagination, either supply your own guards or use <code>setPageIndex</code> directly.
        </p>

        <h2>Mixing modes</h2>
        <ol>
          <li>Server side filtering with client side sorting is a common pairing when the page is small: set <code>filtering</code> and <code>pagination</code> to true and leave sorting off.</li>
          <li>Client side everything with a server side refresh needs no manual flags at all. Write the new array to your data signal and the whole chain re-derives.</li>
          <li>A column with <code>filterable: false</code> still stores its query, which is handy when the query is only ever meant for the server.</li>
        </ol>

        <h2>Debouncing</h2>
        <p>
          The library never debounces. Wire the effect that issues the request through your own timer,
          or read the filter from a form control with <code>debounceTime</code>. Reading
          <code>state()</code> inside an effect gives you one trigger for every slice at once.
        </p>
        <p>
          The state shape is documented in <a routerLink="/state">State and persistence</a>.
        </p>
      </docs-prose>
    </docs-page>
  `,
})
export class ServerSidePage {
  protected readonly loading = signal(false);
  protected readonly total = signal(0);

  private readonly rows = signal<readonly Employee[]>([]);
  private readonly columns = signal(BASIC_COLUMNS);

  protected readonly table = createTable({
    data: this.rows,
    columns: this.columns,
    rowId: (row) => row.id,
    manual: { sorting: true, filtering: true, pagination: true },
    initialState: { pagination: { pageIndex: 0, pageSize: 6 } },
  });

  protected readonly serverPageCount = computed(() =>
    Math.max(1, Math.ceil(this.total() / this.table.pagination().pageSize))
  );

  constructor() {
    effect(() => {
      const query = this.table.globalFilter();
      const sort = this.table.sorting()[0];
      const { pageIndex, pageSize } = this.table.pagination();

      this.loading.set(true);
      fetchPage(query, sort?.id, sort?.direction, pageIndex, pageSize).then((result) => {
        this.rows.set(result.rows);
        this.total.set(result.total);
        this.loading.set(false);
      });
    });
  }

  protected readonly demoTs = `
const rows = signal<Employee[]>([]);
const total = signal(0);
const loading = signal(false);

const table = createTable({
  data: rows,
  columns,
  rowId: (row) => row.id,
  // The server owns all three stages. The state is still tracked.
  manual: { sorting: true, filtering: true, pagination: true },
  initialState: { pagination: { pageIndex: 0, pageSize: 6 } },
});

effect(() => {
  // Every slice this reads becomes a trigger for a new request.
  const query = table.globalFilter();
  const sort = table.sorting()[0];
  const { pageIndex, pageSize } = table.pagination();

  loading.set(true);
  http.get<PageResult>('/api/members', {
    params: {
      q: query,
      sort: sort?.id ?? '',
      direction: sort?.direction ?? '',
      page: pageIndex,
      size: pageSize,
    },
  }).subscribe((result) => {
    rows.set(result.rows);
    total.set(result.total);
    loading.set(false);
  });
});

// pageCount() would describe the single page you were handed,
// so the pager reads the server total instead.
const pageCount = computed(() => Math.max(1, Math.ceil(total() / table.pagination().pageSize)));
`;

  protected readonly api: readonly ApiEntry[] = [
    { name: 'manual.sorting', type: 'boolean', defaultValue: 'false', description: 'Skips the sort stage. sorting() still records what the user asked for, so you can forward it.' },
    { name: 'manual.filtering', type: 'boolean', defaultValue: 'false', description: 'Skips the filter stage. globalFilter() and columnFilters() keep tracking the queries.' },
    { name: 'manual.pagination', type: 'boolean', defaultValue: 'false', description: 'Skips the page slice, so every row you supply is rendered. pagination() keeps the requested page.' },
    { name: 'loading', type: 'boolean (component input)', defaultValue: 'false', description: 'Renders the loading state and sets aria-busy on the tbody while a request is in flight.' },
    { name: 'data', type: '() => readonly T[] (createTable option)', description: 'Under manual mode this is the current page returned by the server, not the whole set.' },
  ];
}
