import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTable } from '@gunerkaanalkim/cairn-datatable';
import { createTable } from '@gunerkaanalkim/cairn-datatable/core';
import { EMPLOYEES, FULL_COLUMNS } from '../shared/sample-data';
import { ApiList, type ApiEntry } from '../ui/api-list';
import { CodeBlock } from '../ui/code-block';
import { DemoBlock } from '../ui/demo-block';
import { DemoPager } from '../ui/demo-pager';
import { DocsPage } from '../ui/docs-page';
import { Prose } from '../ui/prose';

const DEMO_HTML = `
@for (column of table.allColumns(); track column.id) {
  <label>
    <input
      type="checkbox"
      [checked]="table.isColumnVisible(column.id)"
      (change)="table.toggleColumnVisibility(column.id)"
    />
    {{ column.header }}
  </label>
}

<cairn-data-table [table]="table" />
`;

@Component({
  selector: 'app-column-visibility',
  imports: [DataTable, RouterLink, ApiList, CodeBlock, DemoBlock, DemoPager, DocsPage, Prose],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page
      eyebrow="Data"
      heading="Column visibility"
      lead="Hiding a column is state, not configuration. It changes what renders and what the filters can see."
    >
      <docs-demo
        heading="A column picker"
        description="Hide the email column, then search for an email address in the global filter. Nothing matches, because filtering only scans visible columns."
        [html]="demoHtml"
      >
        <div class="mb-4 flex flex-wrap gap-3 rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
          @for (column of table.allColumns(); track column.id) {
            <label class="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                class="focus-ring"
                [checked]="table.isColumnVisible(column.id)"
                (change)="table.toggleColumnVisibility(column.id)"
              />
              {{ column.header }}
            </label>
          }
        </div>

        <div class="mb-4">
          <label class="flex flex-col gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <span>Global filter</span>
            <input
              type="search"
              placeholder="Try an email address, then hide the Email column"
              class="focus-ring w-full rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              (input)="table.setGlobalFilter($any($event.target).value)"
            />
          </label>
        </div>

        <div class="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
          <cairn-data-table [table]="table" caption="Column visibility demo" />
        </div>
        <docs-pager [table]="table" />
      </docs-demo>

      <docs-api heading="Visibility API" [entries]="api" />

      <docs-prose>
        <h2>How it interacts with the rest</h2>
        <ol>
          <li><code>visibleColumns()</code> is what the component renders and what the filter stage scans. Hiding a column therefore removes it from the global search and suspends its column filter.</li>
          <li>Sorting is unaffected. A sort on a hidden column keeps working, which is what you want when a column is hidden purely for width.</li>
          <li><code>allColumns()</code> returns every column with its <code>hidden</code> flag resolved from the current state. It is the correct source for a column picker.</li>
          <li>The <code>hidden</code> flag on a <code>ColumnDef</code> is only read once, on the first render, and only when <code>initialState.hiddenColumns</code> was not supplied.</li>
        </ol>

        <h2>Seeding hidden columns</h2>
      </docs-prose>

      <docs-code [code]="seed" lang="ts" title="Two ways to start with a hidden column" />

      <docs-prose>
        <p>
          Persisting the picker is the same <code>Set</code> round trip described in
          <a routerLink="/state">State and persistence</a>.
        </p>
      </docs-prose>
    </docs-page>
  `,
})
export class ColumnVisibilityPage {
  protected readonly demoHtml = DEMO_HTML;

  protected readonly seed = `
// Declarative: read once, on the first render.
const columns = signal<ColumnDef<Employee>[]>([
  { id: 'name', header: 'Name' },
  { id: 'email', header: 'Email', hidden: true },
]);

// Stateful: wins over every hidden flag above.
const table = createTable({
  data,
  columns,
  initialState: { hiddenColumns: new Set(['email', 'joinedAt']) },
});
`;

  private readonly data = signal(EMPLOYEES);
  private readonly columns = signal(FULL_COLUMNS);

  protected readonly table = createTable({
    data: this.data,
    columns: this.columns,
    rowId: (row) => row.id,
    initialState: { pagination: { pageIndex: 0, pageSize: 6 } },
  });

  protected readonly api: readonly ApiEntry[] = [
    { name: 'allColumns', type: 'Signal<readonly ColumnDef<T>[]>', description: 'Every column with its hidden flag resolved from the current state. Use it to build a picker.' },
    { name: 'visibleColumns', type: 'Signal<readonly ColumnDef<T>[]>', description: 'Columns that are not hidden, in declaration order. This is what renders and what filtering scans.' },
    { name: 'setColumnVisibility', type: '(columnId: string, visible: boolean) => void', description: 'Sets one column to an explicit visibility.' },
    { name: 'toggleColumnVisibility', type: '(columnId: string) => void', description: 'Flips one column.' },
    { name: 'isColumnVisible', type: '(columnId: string) => boolean', description: 'Reads one column. Returns false for an unknown column id.' },
  ];
}
