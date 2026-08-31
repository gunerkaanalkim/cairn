import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTable } from '@gunerkaanalkim/cairn-datatable';
import { createTable, type ColumnDef } from '@gunerkaanalkim/cairn-datatable/core';
import { EMPLOYEES, type Employee } from '../shared/sample-data';
import { ApiList, type ApiEntry } from '../ui/api-list';
import { CodeBlock } from '../ui/code-block';
import { DemoBlock } from '../ui/demo-block';
import { DemoPager } from '../ui/demo-pager';
import { DocsPage } from '../ui/docs-page';
import { Prose } from '../ui/prose';
import { TextInput } from '../ui/text-input';

const DEMO_TS = `
const columns: ColumnDef<Employee>[] = [
  { id: 'name', header: 'Name' },
  { id: 'email', header: 'Email' },
  { id: 'department', header: 'Department' },
  {
    id: 'projects',
    header: 'Projects',
    align: 'end',
    // Understands ">10", "<5" and a plain number.
    filterFn: (value, query) => {
      const count = Number(value);
      const trimmed = query.trim();
      if (trimmed.startsWith('>')) return count > Number(trimmed.slice(1));
      if (trimmed.startsWith('<')) return count < Number(trimmed.slice(1));
      return String(count) === trimmed;
    },
  },
  {
    id: 'id',
    header: 'ID',
    align: 'end',
    // An internal identifier should not pollute the global search.
    globallyFilterable: false,
  },
];
`;

const DEMO_HTML = `
<input placeholder="Search everything" (input)="table.setGlobalFilter($any($event.target).value)" />
<input placeholder="Department" (input)="table.setColumnFilter('department', $any($event.target).value)" />
<input placeholder="Projects, try >10" (input)="table.setColumnFilter('projects', $any($event.target).value)" />
<button (click)="table.clearFilters()">Clear filters</button>

<cairn-data-table [table]="table" />
`;

@Component({
  selector: 'app-filtering',
  imports: [DataTable, RouterLink, ApiList, CodeBlock, DemoBlock, DemoPager, DocsPage, Prose, TextInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page
      eyebrow="Data"
      heading="Filtering"
      lead="One global query across the visible columns, one query per column, and a predicate you can replace at either level."
    >
      <docs-prose>
        <p>
          Both filter kinds are applied in the same stage. A row survives when every non empty column
          filter matches <em>and</em> at least one globally filterable column matches the global
          query. There is no debounce inside the library, so wire the input straight to
          <code>setGlobalFilter</code> or debounce it yourself.
        </p>
      </docs-prose>

      <docs-demo
        heading="Global filter, column filters and a numeric predicate"
        description="Type in the projects box to try >10 or <5. The ID column is excluded from the global search."
        [ts]="demoTs"
        [html]="demoHtml"
      >
        <div class="mb-4 grid gap-3 sm:grid-cols-3">
          <docs-input label="Global filter" placeholder="Search everything" (valueChange)="table.setGlobalFilter($event)" />
          <docs-input label="Department filter" placeholder="Engineering" (valueChange)="table.setColumnFilter('department', $event)" />
          <docs-input label="Projects filter" placeholder="Try >10" (valueChange)="table.setColumnFilter('projects', $event)" />
        </div>

        <div class="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <cairn-data-table [table]="table" caption="Filtering demo" emptyMessage="Nothing matches those filters" />
        </div>
        <docs-pager [table]="table" />
      </docs-demo>

      <docs-api heading="Filtering API" [entries]="api" />

      <docs-prose>
        <h2>The default predicate</h2>
        <ol>
          <li>A <code>null</code> or <code>undefined</code> value never matches.</li>
          <li>Everything else is compared as <code>String(value).toLowerCase().includes(query.toLowerCase())</code>.</li>
          <li>The predicate sees the raw accessor value, not the formatted text. A column that reads as <code>31 Aug 2026</code> is still searched as <code>2026-08-31</code>, which is exactly when a custom <code>filterFn</code> earns its place.</li>
        </ol>

        <h2>Precedence</h2>
        <p>
          A column level <code>filterFn</code> wins over the table level <code>filterFn</code>, which
          wins over the built in predicate. The same function is used for the column filter and for
          that column's contribution to the global filter.
        </p>

        <h2>Two behaviours worth knowing</h2>
        <ol>
          <li>
            <strong>Filtering only scans visible columns.</strong> Hiding a column removes it from the
            global search and suspends its column filter until it is shown again. See
            <a routerLink="/column-visibility">Column visibility</a>.
          </li>
          <li>
            <strong>Every filter write resets the page index to zero.</strong> Without it you would
            routinely land on an empty page four of a two page result.
          </li>
        </ol>
      </docs-prose>

      <docs-code [code]="customFilter" lang="ts" title="A table wide predicate" />

      <docs-prose>
        <p>
          A table level <code>filterFn</code> replaces the default for every column that does not
          define its own. It receives only the value and the query, while a column level predicate
          also receives the row, which is what you need when the decision depends on a second field.
        </p>
      </docs-prose>
    </docs-page>
  `,
})
export class FilteringPage {
  protected readonly demoTs = DEMO_TS;
  protected readonly demoHtml = DEMO_HTML;

  protected readonly customFilter = `
const table = createTable({
  data,
  columns,
  // Word prefix matching instead of a substring match.
  filterFn: (value, query) =>
    String(value)
      .toLowerCase()
      .split(/\\s+/)
      .some((word) => word.startsWith(query.toLowerCase())),
});
`;

  private readonly data = signal(EMPLOYEES);

  private readonly columnDefs: readonly ColumnDef<Employee>[] = [
    { id: 'id', header: 'ID', align: 'end', globallyFilterable: false },
    { id: 'name', header: 'Name' },
    { id: 'email', header: 'Email' },
    { id: 'department', header: 'Department' },
    {
      id: 'projects',
      header: 'Projects',
      align: 'end',
      filterFn: (value, query) => {
        const count = Number(value);
        const trimmed = query.trim();
        if (trimmed.startsWith('>')) return count > Number(trimmed.slice(1));
        if (trimmed.startsWith('<')) return count < Number(trimmed.slice(1));
        return String(count) === trimmed;
      },
    },
  ];

  private readonly columns = signal(this.columnDefs);

  protected readonly table = createTable({
    data: this.data,
    columns: this.columns,
    rowId: (row) => row.id,
    initialState: { pagination: { pageIndex: 0, pageSize: 8 } },
  });

  protected readonly api: readonly ApiEntry[] = [
    { name: 'globalFilter', type: 'Signal<string>', description: 'The current global query. An empty string means no global filtering.' },
    { name: 'columnFilters', type: 'Signal<Readonly<Record<string, string>>>', description: 'Query per column id. Empty values are kept in the record but skipped while filtering.' },
    { name: 'setGlobalFilter', type: '(query: string) => void', description: 'Replaces the global query and resets the page index to zero.' },
    { name: 'setColumnFilter', type: '(columnId: string, query: string) => void', description: 'Replaces the query for one column and resets the page index to zero.' },
    { name: 'clearFilters', type: '() => void', description: 'Clears the global query and every column query, then resets the page index.' },
    { name: 'filteredRowCount', type: 'Signal<number>', description: 'Number of rows surviving the filters, before pagination.' },
    { name: 'totalRowCount', type: 'Signal<number>', description: 'Number of source rows, ignoring every filter.' },
  ];
}
