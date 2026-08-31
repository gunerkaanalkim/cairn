import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTable } from '@gunerkaanalkim/cairn-datatable';
import { createTable, type ColumnDef } from '@gunerkaanalkim/cairn-datatable/core';
import { EMPLOYEES, type Employee } from '../shared/sample-data';
import { ApiList, type ApiEntry } from '../ui/api-list';
import { DemoBlock } from '../ui/demo-block';
import { DemoPager } from '../ui/demo-pager';
import { DocsPage } from '../ui/docs-page';
import { Prose } from '../ui/prose';

const DEMO_TS = `
import { createTable, type ColumnDef } from '@gunerkaanalkim/cairn-datatable/core';

const columns: ColumnDef<Employee>[] = [
  // The id doubles as the accessor key when no accessor is given.
  { id: 'name', header: 'Member' },

  // accessor reads a value the row does not expose directly.
  {
    id: 'initials',
    header: 'Initials',
    accessor: (row) => row.name.split(' ').map((part) => part[0]).join(''),
    sortable: false,
    globallyFilterable: false,
  },

  // formatter only changes the rendered text, sorting still sees the raw value.
  {
    id: 'projects',
    header: 'Projects',
    align: 'end',
    formatter: (value) => (value === 0 ? 'none' : String(value) + ' active'),
  },

  // meta is never read by the library, it is there for your own renderers.
  {
    id: 'status',
    header: 'Status',
    meta: { badge: true },
  },

  // hidden keeps the column out of the first render.
  { id: 'email', header: 'Email', hidden: true },
];
`;

@Component({
  selector: 'app-columns',
  imports: [DataTable, RouterLink, ApiList, DemoBlock, DemoPager, DocsPage, Prose],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page
      eyebrow="Data"
      heading="Columns"
      lead="A column definition is a plain object. It decides where a value comes from, how it reads on screen and which pipeline stages may touch it."
    >
      <docs-prose>
        <p>
          Only <code>id</code> and <code>header</code> are required. The <code>id</code> is the
          accessor key by default, the identity used by <code>data-column-id</code>, and the key you
          pass to <code>setColumnFilter</code>, <code>toggleSort</code> and the template directives,
          so keep it unique and stable.
        </p>
      </docs-prose>

      <docs-demo
        heading="Accessors, formatters and alignment"
        description="A derived column, a formatted number, an aligned column and a column that starts hidden."
        [ts]="demoTs"
      >
        <div class="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <cairn-data-table [table]="table" caption="Column definition showcase" />
        </div>
        <docs-pager [table]="table" />
      </docs-demo>

      <docs-api heading="ColumnDef fields" [entries]="fields" />

      <docs-prose>
        <h2>Accessor or formatter?</h2>
        <ol>
          <li>
            <strong>accessor</strong> changes the <em>value</em>. Sorting, filtering and
            <code>cellValue</code> all see whatever it returns.
          </li>
          <li>
            <strong>formatter</strong> changes the <em>text</em>. It runs last and only affects
            <code>cellText</code>, so a date still sorts chronologically while it reads as
            <code>31 Aug 2026</code>.
          </li>
        </ol>
        <p>
          That separation is the reason a currency column sorts numerically without any extra
          comparator: format the number, do not stringify it in the accessor.
        </p>

        <h2>Turning stages off per column</h2>
        <ol>
          <li><code>sortable: false</code> removes the header button entirely and makes <code>toggleSort</code> a no-op for that column. <code>setSorting</code> silently drops entries pointing at it.</li>
          <li><code>filterable: false</code> makes <code>setColumnFilter</code> store the query but never apply it.</li>
          <li><code>globallyFilterable: false</code> keeps the column out of the global filter scan, which is what you want for an internal identifier.</li>
          <li><code>hidden: true</code> is only read on the first render, and only when <code>initialState.hiddenColumns</code> was not supplied. After that, visibility is state, not configuration.</li>
        </ol>

        <h2>Changing columns at runtime</h2>
        <p>
          <code>columns</code> is an accessor, so writing a new array to the signal re-derives
          everything. Filters and sorts pointing at a removed column stay in state but stop matching,
          which keeps a restored view from throwing.
        </p>
        <p>
          For per-column rendering rather than per-column values, see
          <a routerLink="/templates">Templates</a>.
        </p>
      </docs-prose>
    </docs-page>
  `,
})
export class ColumnsPage {
  protected readonly demoTs = DEMO_TS;

  private readonly data = signal(EMPLOYEES.slice(0, 24));

  private readonly columnDefs: readonly ColumnDef<Employee>[] = [
    { id: 'name', header: 'Member' },
    {
      id: 'initials',
      header: 'Initials',
      accessor: (row) =>
        row.name
          .split(' ')
          .map((part) => part[0])
          .join(''),
      sortable: false,
      globallyFilterable: false,
    },
    {
      id: 'projects',
      header: 'Projects',
      align: 'end',
      formatter: (value) => (value === 0 ? 'none' : `${String(value)} active`),
    },
    { id: 'status', header: 'Status', meta: { badge: true } },
    { id: 'email', header: 'Email', hidden: true },
  ];

  private readonly columns = signal(this.columnDefs);

  protected readonly table = createTable({
    data: this.data,
    columns: this.columns,
    rowId: (row) => row.id,
    initialState: { pagination: { pageIndex: 0, pageSize: 6 } },
  });

  protected readonly fields: readonly ApiEntry[] = [
    { name: 'id', type: 'string', description: 'Unique identifier. Also the default accessor key and the value published as data-column-id.' },
    { name: 'header', type: 'string', description: 'Text rendered in the header cell when no cairnHeader template overrides it.' },
    { name: 'accessor', type: '(row: T) => unknown', defaultValue: '(row) => row[id]', description: 'Extracts the raw value. Sorting, filtering and cellValue all read through it.' },
    { name: 'formatter', type: '(value: unknown, row: T) => string', defaultValue: 'String(value), empty string for null and undefined', description: 'Converts the raw value into display text. Affects cellText only, never sorting or filtering.' },
    { name: 'sortable', type: 'boolean', defaultValue: 'true', description: 'When false the header renders as plain text with no button and the column cannot be sorted.' },
    { name: 'filterable', type: 'boolean', defaultValue: 'true', description: 'When false the per column filter for this column is ignored.' },
    { name: 'globallyFilterable', type: 'boolean', defaultValue: 'true', description: 'When false the column is skipped while scanning for a global filter match.' },
    { name: 'hidden', type: 'boolean', defaultValue: 'false', description: 'Hides the column on first render. Ignored when initialState.hiddenColumns is provided.' },
    { name: 'align', type: "'start' | 'center' | 'end'", defaultValue: "'start'", description: 'Published as data-align on the header cell and every body cell. The shipped stylesheet turns it into text alignment.' },
    { name: 'sortFn', type: '(a: unknown, b: unknown, rowA: T, rowB: T) => number', description: 'Custom comparator for this column. Receives raw values, not formatted text. The direction is applied afterwards.' },
    { name: 'filterFn', type: '(value: unknown, query: string, row: T) => boolean', description: 'Custom predicate for this column. Used by both the column filter and the global filter.' },
    { name: 'meta', type: 'Readonly<Record<string, unknown>>', description: 'Arbitrary consumer data. The library never reads it, template code can.' },
  ];
}
