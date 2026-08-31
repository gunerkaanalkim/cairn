import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CairnCell, CairnEmpty, CairnHeader, CairnLoading, DataTable } from '@gunerkaanalkim/cairn-datatable';
import { createTable, type ColumnDef } from '@gunerkaanalkim/cairn-datatable/core';
import { EMPLOYEES, type Employee } from '../shared/sample-data';
import { ApiList, type ApiEntry } from '../ui/api-list';
import { CodeBlock } from '../ui/code-block';
import { DemoBlock } from '../ui/demo-block';
import { DemoPager } from '../ui/demo-pager';
import { DocsPage } from '../ui/docs-page';
import { Prose } from '../ui/prose';

const DEMO_HTML = `
<cairn-data-table [table]="table" [loading]="loading()">
  <!-- One column, by id. The context carries the raw value and the row. -->
  <ng-template cairnCell="status" let-value let-row="row">
    <span class="badge" [class.badge-active]="value === 'active'">{{ value }}</span>
  </ng-template>

  <!-- A column with no underlying field, driven purely by the template. -->
  <ng-template cairnCell="actions" let-row="row">
    <button type="button" (click)="invite(row)">Invite</button>
  </ng-template>

  <!-- Header override for a single column. -->
  <ng-template cairnHeader="projects" let-column>
    <span title="Projects the member is assigned to">{{ column.header }} #</span>
  </ng-template>

  <!-- Shown when the current page is empty. -->
  <ng-template cairnEmpty>
    <div class="empty">No members match this search.</div>
  </ng-template>

  <!-- Shown instead of the body while [loading] is true. -->
  <ng-template cairnLoading>
    <div class="loading">Fetching members…</div>
  </ng-template>
</cairn-data-table>
`;

const DEMO_TS = `
const columns: ColumnDef<Employee>[] = [
  { id: 'name', header: 'Name' },
  { id: 'status', header: 'Status' },
  { id: 'projects', header: 'Projects', align: 'end' },
  // An action column is a normal column with nothing to read and nothing to sort.
  { id: 'actions', header: '', sortable: false, filterable: false, globallyFilterable: false },
];
`;

@Component({
  selector: 'app-templates',
  imports: [
    DataTable,
    CairnCell,
    CairnHeader,
    CairnEmpty,
    CairnLoading,
    ApiList,
    CodeBlock,
    DemoBlock,
    DemoPager,
    DocsPage,
    Prose,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page
      eyebrow="Rendering"
      heading="Templates"
      lead="Four structural directives let you replace any cell, any header, the empty state and the loading state without giving up the rest of the component."
    >
      <docs-prose>
        <p>
          Each directive is a plain <code>ng-template</code> projected into
          <code>cairn-data-table</code>. <code>cairnCell</code> and <code>cairnHeader</code> take an
          optional column id: with an id they override that one column, without an id they override
          every column. A column specific template always wins over the generic one.
        </p>
      </docs-prose>

      <docs-demo
        heading="Badges, an action column and custom states"
        description="Toggle the loading state or filter down to nothing to see the two state templates."
        [ts]="demoTs"
        [html]="demoHtml"
      >
        <div class="mb-4 flex flex-wrap items-center gap-2 text-sm">
          <button
            type="button"
            class="focus-ring rounded-md border border-zinc-200 px-3 py-1 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            (click)="loading.set(!loading())"
          >
            {{ loading() ? 'Stop loading' : 'Show loading state' }}
          </button>
          <button
            type="button"
            class="focus-ring rounded-md border border-zinc-200 px-3 py-1 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            (click)="table.setGlobalFilter('no-such-person')"
          >
            Show empty state
          </button>
          <button
            type="button"
            class="focus-ring rounded-md border border-zinc-200 px-3 py-1 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            (click)="table.clearFilters()"
          >
            Reset
          </button>
          @if (lastInvited()) {
            <span class="text-zinc-500 dark:text-zinc-400">Invited {{ lastInvited() }}</span>
          }
        </div>

        <div class="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <cairn-data-table [table]="table" [loading]="loading()" caption="Template demo">
            <ng-template cairnCell="status" let-value>
              <span
                class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                [class]="badgeClass(value)"
              >
                {{ value }}
              </span>
            </ng-template>

            <ng-template cairnCell="actions" let-row="row">
              <button
                type="button"
                class="focus-ring rounded-md border border-zinc-200 px-2 py-0.5 text-xs hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                (click)="invite(row)"
              >
                Invite
              </button>
            </ng-template>

            <ng-template cairnHeader="projects" let-column>
              <span [title]="'Projects ' + column.header">{{ column.header }} #</span>
            </ng-template>

            <ng-template cairnEmpty>
              <div class="py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                No members match this search.
              </div>
            </ng-template>

            <ng-template cairnLoading>
              <div class="py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                Fetching members…
              </div>
            </ng-template>
          </cairn-data-table>
        </div>
        <docs-pager [table]="table" />
      </docs-demo>

      <docs-api heading="Directives" [entries]="api" />

      <docs-prose>
        <h2>Template context</h2>
        <ol>
          <li><code>cairnCell</code> exposes the raw accessor value as <code>$implicit</code>, the original row object as <code>row</code>, and the column id as <code>columnId</code>. Note that it is the <em>raw</em> value, so a formatter does not apply inside your template.</li>
          <li><code>cairnHeader</code> exposes the <code>ColumnDef</code> as <code>$implicit</code>, which is how you reach <code>meta</code> from the header.</li>
          <li><code>cairnEmpty</code> and <code>cairnLoading</code> take no context.</li>
        </ol>
      </docs-prose>

      <docs-code [code]="context" lang="html" title="Reading the context" />

      <docs-prose>
        <h2>Where the state templates render</h2>
        <ol>
          <li>The loading template replaces the whole body while the <code>loading</code> input is true, in a single cell spanning every column, and the body carries <code>aria-busy="true"</code>.</li>
          <li>The empty template renders when <code>isEmpty()</code> is true, again in a spanning cell.</li>
          <li>Without a template, the component falls back to <code>Loading...</code> and to the <code>emptyMessage</code> input, whose default is <code>DEFAULT_EMPTY_MESSAGE</code>.</li>
        </ol>

        <h2>Keeping the header sortable</h2>
        <p>
          A <code>cairnHeader</code> template is rendered <em>inside</em> the sort button, so the
          column stays sortable and keyboard reachable. Put no button of your own in there. If a
          column should not sort, set <code>sortable: false</code> on its definition and the header
          renders as plain content instead.
        </p>
      </docs-prose>
    </docs-page>
  `,
})
export class TemplatesPage {
  protected readonly demoHtml = DEMO_HTML;
  protected readonly demoTs = DEMO_TS;
  protected readonly loading = signal(false);
  protected readonly lastInvited = signal('');

  protected readonly context = `
<ng-template cairnCell="email" let-value let-row="row" let-columnId="columnId">
  <a [href]="'mailto:' + value" [attr.data-column]="columnId">{{ row.name }}</a>
</ng-template>

<ng-template cairnHeader let-column>
  <span [class.required]="column.meta?.['required'] === true">{{ column.header }}</span>
</ng-template>
`;

  private readonly data = signal(EMPLOYEES.slice(0, 18));

  private readonly columnDefs: readonly ColumnDef<Employee>[] = [
    { id: 'name', header: 'Name' },
    { id: 'department', header: 'Department' },
    { id: 'status', header: 'Status' },
    { id: 'projects', header: 'Projects', align: 'end' },
    { id: 'actions', header: '', sortable: false, filterable: false, globallyFilterable: false },
  ];

  private readonly columns = signal(this.columnDefs);

  protected readonly table = createTable({
    data: this.data,
    columns: this.columns,
    rowId: (row) => row.id,
    initialState: { pagination: { pageIndex: 0, pageSize: 6 } },
  });

  protected badgeClass(value: unknown): string {
    switch (value) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300';
      case 'invited':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300';
      default:
        return 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200';
    }
  }

  protected invite(row: Employee): void {
    this.lastInvited.set(row.name);
  }

  protected readonly api: readonly ApiEntry[] = [
    { name: 'cairnCell', type: 'ng-template, optional column id', description: 'Replaces the body cell content. Context: $implicit is the raw value, row is the source object, columnId is the column id.' },
    { name: 'cairnHeader', type: 'ng-template, optional column id', description: 'Replaces the header content. Context: $implicit is the ColumnDef. Rendered inside the sort button when the column is sortable.' },
    { name: 'cairnEmpty', type: 'ng-template', description: 'Replaces the empty state row. No context.' },
    { name: 'cairnLoading', type: 'ng-template', description: 'Replaces the body while the loading input is true. No context.' },
    { name: 'loading', type: 'boolean (component input)', defaultValue: 'false', description: 'Swaps the body for the loading state and sets aria-busy on the tbody.' },
    { name: 'emptyMessage', type: 'string (component input)', defaultValue: "'No records found'", description: 'Fallback text when no cairnEmpty template is provided.' },
  ];
}
