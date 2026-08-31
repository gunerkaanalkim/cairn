import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTable } from '@gunerkaanalkim/cairn-datatable';
import { createTable, type TableState } from '@gunerkaanalkim/cairn-datatable/core';
import { EMPLOYEES, FULL_COLUMNS } from '../shared/sample-data';
import { ApiList, type ApiEntry } from '../ui/api-list';
import { CodeBlock } from '../ui/code-block';
import { DemoBlock } from '../ui/demo-block';
import { DemoPager } from '../ui/demo-pager';
import { DocsPage } from '../ui/docs-page';
import { Prose } from '../ui/prose';

const STORAGE_KEY = 'cairn-docs-saved-view';

@Component({
  selector: 'app-state',
  imports: [DataTable, RouterLink, ApiList, CodeBlock, DemoBlock, DemoPager, DocsPage, Prose],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page
      eyebrow="Advanced"
      heading="State and persistence"
      lead="Six pieces of state, one snapshot signal and one setter. Saving a view is a serialisation problem, not an API problem."
    >
      <docs-prose>
        <p>
          Everything the table remembers lives in <code>state()</code>: <code>sorting</code>,
          <code>globalFilter</code>, <code>columnFilters</code>, <code>pagination</code>,
          <code>selection</code> and <code>hiddenColumns</code>. Each is also exposed as its own
          signal, so a control can subscribe to just the slice it renders.
        </p>
      </docs-prose>

      <docs-demo
        heading="Save and restore a view"
        description="Sort a column, hide one, type a filter, then save. Reload the page and restore: everything comes back, selection included."
        [ts]="persistTs"
      >
        <div class="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <button
            type="button"
            class="focus-ring rounded-md border border-zinc-200 px-3 py-1.5 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            (click)="save()"
          >
            Save view
          </button>
          <button
            type="button"
            class="focus-ring rounded-md border border-zinc-200 px-3 py-1.5 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            (click)="restore()"
          >
            Restore view
          </button>
          <button
            type="button"
            class="focus-ring rounded-md border border-zinc-200 px-3 py-1.5 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            (click)="reset()"
          >
            Reset
          </button>
          <button
            type="button"
            class="focus-ring rounded-md border border-zinc-200 px-3 py-1.5 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            (click)="table.toggleColumnVisibility('email')"
          >
            Toggle email column
          </button>
          @if (message()) {
            <span class="text-zinc-500 dark:text-zinc-400">{{ message() }}</span>
          }
        </div>

        <div class="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
          <cairn-data-table [table]="table" [selectable]="true" caption="State demo" />
        </div>
        <docs-pager [table]="table" [showSelection]="true" />

        <pre
          class="mt-4 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50 p-4 font-mono text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
        >{{ snapshot() }}</pre>
      </docs-demo>

      <docs-api heading="State API" [entries]="api" />

      <docs-prose>
        <h2>Serialisation</h2>
        <p>
          Two fields are <code>Set</code> objects, and <code>JSON.stringify</code> turns a
          <code>Set</code> into <code>{{ '{}' }}</code> without complaining. Convert both directions
          explicitly.
        </p>
      </docs-prose>

      <docs-code [code]="persistTs" lang="ts" title="A safe round trip" />

      <docs-prose>
        <h2>setState is a partial write</h2>
        <ol>
          <li>Only the keys you pass are written. Omitted keys keep their current value, they are not reset.</li>
          <li>It is the same shape as <code>initialState</code>, so a snapshot taken today can be fed to either one.</li>
          <li>It bypasses the guards that the individual setters apply. Writing a page index past the end is allowed, and the rendered page clamps for that read.</li>
        </ol>

        <h2>Reacting to state changes</h2>
        <p>
          <code>state()</code> is a plain computed signal, so an <code>effect</code> is all you need
          to sync it to a query string, to <code>localStorage</code> or to a server. Persisting on
          every keystroke is rarely what you want, so debounce or persist on navigation.
        </p>
      </docs-prose>

      <docs-code [code]="effectTs" lang="ts" title="Syncing with an effect" />

      <docs-prose>
        <p>
          When the server owns sorting, filtering or paging, the same state drives your request. See
          <a routerLink="/server-side">Server side data</a>.
        </p>
      </docs-prose>
    </docs-page>
  `,
})
export class StatePage {
  protected readonly message = signal('');

  private readonly data = signal(EMPLOYEES);
  private readonly columns = signal(FULL_COLUMNS);

  protected readonly table = createTable({
    data: this.data,
    columns: this.columns,
    rowId: (row) => row.id,
    initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
  });

  protected readonly snapshot = computed(() => {
    const state = this.table.state();
    return JSON.stringify(
      {
        sorting: state.sorting,
        globalFilter: state.globalFilter,
        columnFilters: state.columnFilters,
        pagination: state.pagination,
        selection: Array.from(state.selection),
        hiddenColumns: Array.from(state.hiddenColumns),
      },
      null,
      2
    );
  });

  protected save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, this.snapshot());
      this.message.set('Saved to localStorage.');
    } catch {
      this.message.set('Storage is unavailable in this browser.');
    }
  }

  protected restore(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.message.set('Nothing saved yet.');
        return;
      }
      const parsed = JSON.parse(raw) as {
        sorting: TableState['sorting'];
        globalFilter: string;
        columnFilters: Record<string, string>;
        pagination: TableState['pagination'];
        selection: (string | number)[];
        hiddenColumns: string[];
      };
      this.table.setState({
        sorting: parsed.sorting,
        globalFilter: parsed.globalFilter,
        columnFilters: parsed.columnFilters,
        pagination: parsed.pagination,
        selection: new Set(parsed.selection),
        hiddenColumns: new Set(parsed.hiddenColumns),
      });
      this.message.set('Restored.');
    } catch {
      this.message.set('The saved view could not be read.');
    }
  }

  protected reset(): void {
    this.table.setState({
      sorting: [],
      globalFilter: '',
      columnFilters: {},
      pagination: { pageIndex: 0, pageSize: 5 },
      selection: new Set(),
      hiddenColumns: new Set(),
    });
    this.message.set('');
  }

  protected readonly persistTs = `
import type { TableState } from '@gunerkaanalkim/cairn-datatable/core';

function serialize(state: TableState): string {
  return JSON.stringify({
    ...state,
    // A Set does not survive JSON.stringify.
    selection: Array.from(state.selection),
    hiddenColumns: Array.from(state.hiddenColumns),
  });
}

function restore(table: TableApi<Employee>, raw: string): void {
  const parsed = JSON.parse(raw);
  table.setState({
    ...parsed,
    selection: new Set(parsed.selection),
    hiddenColumns: new Set(parsed.hiddenColumns),
  });
}
`;

  protected readonly effectTs = `
effect(() => {
  const state = this.table.state();
  // Runs whenever any slice of the state changes.
  this.router.navigate([], {
    queryParams: { q: state.globalFilter || null, page: state.pagination.pageIndex || null },
    queryParamsHandling: 'merge',
    replaceUrl: true,
  });
});
`;

  protected readonly api: readonly ApiEntry[] = [
    { name: 'state', type: 'Signal<TableState>', description: 'Snapshot of all six slices. A computed signal, so it recomputes when any slice changes.' },
    { name: 'setState', type: '(state: Partial<TableState>) => void', description: 'Writes the keys you provide and leaves the rest untouched. Applies no clamping or validation.' },
    { name: 'initialState', type: 'Partial<TableState> (createTable option)', description: 'Seeds the same six slices before the first render.' },
    { name: 'sorting', type: 'Signal<readonly SortState[]>', description: 'Ordered sort entries.' },
    { name: 'globalFilter', type: 'Signal<string>', description: 'The global query.' },
    { name: 'columnFilters', type: 'Signal<Readonly<Record<string, string>>>', description: 'Query per column id.' },
    { name: 'pagination', type: 'Signal<PaginationState>', description: 'Stored page index and page size.' },
    { name: 'selection', type: 'Signal<ReadonlySet<RowId>>', description: 'Selected row identities.' },
  ];
}
