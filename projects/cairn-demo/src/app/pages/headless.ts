import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { createTable, type ColumnDef } from '@gunerkaanalkim/cairn-datatable/core';
import { EMPLOYEES, type Employee } from '../shared/sample-data';
import { ApiList, type ApiEntry } from '../ui/api-list';
import { CodeBlock } from '../ui/code-block';
import { DemoBlock } from '../ui/demo-block';
import { DemoPager } from '../ui/demo-pager';
import { DocsPage } from '../ui/docs-page';
import { Prose } from '../ui/prose';

const DEMO_TS = `
import { Component, signal } from '@angular/core';
// Note the /core entry point: no component, no template, no table markup.
import { createTable } from '@gunerkaanalkim/cairn-datatable/core';

@Component({
  selector: 'app-member-cards',
  template: \`
    <input (input)="table.setGlobalFilter($any($event.target).value)" />

    @for (row of table.rows(); track row.id) {
      <article [class.selected]="row.selected" (click)="table.toggleRowSelection(row.id)">
        <h3>{{ table.cellText(row, 'name') }}</h3>
        <p>{{ table.cellText(row, 'role') }} · {{ table.cellText(row, 'department') }}</p>
        <span>{{ table.cellText(row, 'projects') }}</span>
      </article>
    }

    <button (click)="table.nextPage()">Next page</button>
  \`,
})
export class MemberCards {
  readonly data = signal(EMPLOYEES);
  readonly columns = signal(COLUMNS);

  readonly table = createTable({
    data: this.data,
    columns: this.columns,
    rowId: (row) => row.id,
  });
}
`;

@Component({
  selector: 'app-headless',
  imports: [RouterLink, ApiList, CodeBlock, DemoBlock, DemoPager, DocsPage, Prose],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page
      eyebrow="Rendering"
      heading="Headless usage"
      lead="The core entry point is the whole library minus the markup. Import it alone and render rows however you like."
    >
      <docs-prose>
        <p>
          <code>createTable</code> knows nothing about tables. It sorts, filters, pages and selects
          rows, then hands you signals. A card grid, a virtualised list, a chart legend or a mobile
          accordion are all the same amount of work.
        </p>
        <p>
          Importing only <code>@gunerkaanalkim/cairn-datatable/core</code> leaves the component, its
          template and the four directives out of your bundle entirely.
        </p>
      </docs-prose>

      <docs-demo
        heading="A card grid driven by the same API"
        description="Sorting, filtering, paging and selection, with no table element anywhere."
        [ts]="demoTs"
      >
        <div class="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <input
            type="search"
            placeholder="Filter members"
            class="focus-ring rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            (input)="table.setGlobalFilter($any($event.target).value)"
          />
          <button
            type="button"
            class="focus-ring rounded-md border border-zinc-200 px-3 py-1.5 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            (click)="table.toggleSort('name')"
          >
            Sort by name
          </button>
          <button
            type="button"
            class="focus-ring rounded-md border border-zinc-200 px-3 py-1.5 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            (click)="table.clearSelection()"
          >
            Clear selection
          </button>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          @for (row of table.rows(); track row.id) {
            <button
              type="button"
              class="focus-ring rounded-xl border p-4 text-left transition"
              [class]="
                row.selected
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                  : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700'
              "
              [attr.aria-pressed]="row.selected"
              (click)="table.toggleRowSelection(row.id)"
            >
              <span class="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {{ table.cellText(row, 'name') }}
              </span>
              <span class="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">
                {{ table.cellText(row, 'role') }} · {{ table.cellText(row, 'department') }}
              </span>
              <span class="mt-3 block text-xs font-medium text-indigo-600 dark:text-indigo-400">
                {{ table.cellText(row, 'projects') }}
              </span>
            </button>
          } @empty {
            <p class="col-span-full py-8 text-center text-sm text-zinc-500">No members match.</p>
          }
        </div>

        <docs-pager [table]="table" [showSelection]="true" />
      </docs-demo>

      <docs-api heading="What you render with" [entries]="api" />

      <docs-prose>
        <h2>cellValue or cellText?</h2>
        <ol>
          <li><code>cellValue</code> returns the raw accessor result, typed as <code>unknown</code>. Use it when you need the number, the date object or the boolean.</li>
          <li><code>cellText</code> applies the column formatter and always returns a string, with <code>null</code> and <code>undefined</code> becoming an empty string. Use it for display.</li>
          <li>Both return a safe fallback for an unknown column id rather than throwing.</li>
        </ol>
        <p>
          Nothing stops you from reading <code>row.data</code> directly, and for a hand written view
          that is often clearer. The accessor pair exists so a generic renderer can stay driven by the
          column definitions.
        </p>

        <h2>Building your own header</h2>
      </docs-prose>

      <docs-code [code]="header" lang="html" title="A sortable header without a table" />

      <docs-prose>
        <p>
          Everything the component does is built on this API. If you want the component's markup as a
          starting point, the <a routerLink="/api">API reference</a> lists the exact elements,
          classes and attributes it emits.
        </p>
      </docs-prose>
    </docs-page>
  `,
})
export class HeadlessPage {
  protected readonly demoTs = DEMO_TS;

  protected readonly header = `
@for (column of table.visibleColumns(); track column.id) {
  <button
    type="button"
    [attr.aria-sort]="ariaSortFor(column.id)"
    (click)="table.toggleSort(column.id, $event.shiftKey)"
  >
    {{ column.header }}
  </button>
}
`;

  private readonly data = signal(EMPLOYEES);

  private readonly columnDefs: readonly ColumnDef<Employee>[] = [
    { id: 'name', header: 'Name' },
    { id: 'role', header: 'Role' },
    { id: 'department', header: 'Department' },
    {
      id: 'projects',
      header: 'Projects',
      formatter: (value) => (value === 1 ? '1 project' : `${String(value)} projects`),
    },
  ];

  private readonly columns = signal(this.columnDefs);

  protected readonly table = createTable({
    data: this.data,
    columns: this.columns,
    rowId: (row) => row.id,
    initialState: { pagination: { pageIndex: 0, pageSize: 6 } },
  });

  protected readonly api: readonly ApiEntry[] = [
    { name: 'rows', type: 'Signal<readonly Row<T>[]>', description: 'The current page. Each Row carries id, data, sourceIndex and selected.' },
    { name: 'sortedRows', type: 'Signal<readonly Row<T>[]>', description: 'Filtered and sorted rows before the page slice.' },
    { name: 'visibleColumns', type: 'Signal<readonly ColumnDef<T>[]>', description: 'Columns to render, in declaration order.' },
    { name: 'cellValue', type: '(row: Row<T>, columnId: string) => unknown', description: 'Raw accessor value. Returns undefined for an unknown column id.' },
    { name: 'cellText', type: '(row: Row<T>, columnId: string) => string', description: 'Formatted display text. Returns an empty string for an unknown column id.' },
    { name: 'isEmpty', type: 'Signal<boolean>', description: 'True when the current page has no rows.' },
  ];
}
