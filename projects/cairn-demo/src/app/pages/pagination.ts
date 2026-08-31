import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTable } from '@gunerkaanalkim/cairn-datatable';
import { createTable } from '@gunerkaanalkim/cairn-datatable/core';
import { EMPLOYEES, FULL_COLUMNS } from '../shared/sample-data';
import { ApiList, type ApiEntry } from '../ui/api-list';
import { CodeBlock } from '../ui/code-block';
import { DemoBlock } from '../ui/demo-block';
import { DocsPage } from '../ui/docs-page';
import { Prose } from '../ui/prose';

const DEMO_HTML = `
<cairn-data-table [table]="table" />

<div class="pager">
  <button (click)="table.firstPage()" [disabled]="table.pagination().pageIndex === 0">First</button>
  <button (click)="table.previousPage()" [disabled]="table.pagination().pageIndex === 0">Previous</button>

  <span>Page {{ table.pagination().pageIndex + 1 }} of {{ table.pageCount() }}</span>

  <button (click)="table.nextPage()" [disabled]="table.pagination().pageIndex >= table.pageCount() - 1">Next</button>
  <button (click)="table.lastPage()" [disabled]="table.pagination().pageIndex >= table.pageCount() - 1">Last</button>

  <select (change)="table.setPageSize(+$any($event.target).value)">
    <option value="5">5 per page</option>
    <option value="10">10 per page</option>
    <option value="25">25 per page</option>
  </select>

  <span>{{ table.filteredRowCount() }} of {{ table.totalRowCount() }} rows</span>
</div>
`;

@Component({
  selector: 'app-pagination',
  imports: [DataTable, RouterLink, ApiList, CodeBlock, DemoBlock, DocsPage, Prose],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page
      eyebrow="Data"
      heading="Pagination"
      lead="A page index, a page size, and six methods that can never move you outside the valid range."
    >
      <docs-prose>
        <p>
          The library renders no pagination control. It exposes the state and the arithmetic, you
          render the buttons. The markup below is the complete pager used across this site.
        </p>
      </docs-prose>

      <docs-demo
        heading="A complete pager"
        description="Change the page size while on a late page and the view clamps to the last valid page instead of going blank."
        [html]="demoHtml"
      >
        <div class="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <cairn-data-table [table]="table" caption="Pagination demo" />
        </div>

        <div class="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <button
            type="button"
            class="focus-ring rounded-md border border-zinc-200 px-2.5 py-1 disabled:opacity-40 hover:enabled:bg-zinc-100 dark:border-zinc-700 dark:hover:enabled:bg-zinc-800"
            [disabled]="table.pagination().pageIndex === 0"
            (click)="table.firstPage()"
          >
            First
          </button>
          <button
            type="button"
            class="focus-ring rounded-md border border-zinc-200 px-2.5 py-1 disabled:opacity-40 hover:enabled:bg-zinc-100 dark:border-zinc-700 dark:hover:enabled:bg-zinc-800"
            [disabled]="table.pagination().pageIndex === 0"
            (click)="table.previousPage()"
          >
            Previous
          </button>
          <span class="tabular-nums text-zinc-600 dark:text-zinc-400">
            Page {{ table.pagination().pageIndex + 1 }} of {{ table.pageCount() }}
          </span>
          <button
            type="button"
            class="focus-ring rounded-md border border-zinc-200 px-2.5 py-1 disabled:opacity-40 hover:enabled:bg-zinc-100 dark:border-zinc-700 dark:hover:enabled:bg-zinc-800"
            [disabled]="table.pagination().pageIndex >= table.pageCount() - 1"
            (click)="table.nextPage()"
          >
            Next
          </button>
          <button
            type="button"
            class="focus-ring rounded-md border border-zinc-200 px-2.5 py-1 disabled:opacity-40 hover:enabled:bg-zinc-100 dark:border-zinc-700 dark:hover:enabled:bg-zinc-800"
            [disabled]="table.pagination().pageIndex >= table.pageCount() - 1"
            (click)="table.lastPage()"
          >
            Last
          </button>

          <label class="ml-2 flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <span class="sr-only">Rows per page</span>
            <select
              class="focus-ring rounded-md border border-zinc-200 bg-white px-2 py-1 dark:border-zinc-700 dark:bg-zinc-900"
              (change)="setSize($any($event.target).value)"
            >
              @for (size of sizes; track size) {
                <option [value]="size" [selected]="size === table.pagination().pageSize">
                  {{ size }} per page
                </option>
              }
            </select>
          </label>

          <span class="ml-auto tabular-nums text-zinc-500 dark:text-zinc-400">
            {{ table.filteredRowCount() }} of {{ table.totalRowCount() }} rows
          </span>
        </div>
      </docs-demo>

      <docs-api heading="Pagination API" [entries]="api" />

      <docs-prose>
        <h2>Guarantees</h2>
        <ol>
          <li><code>pageCount()</code> is never below one, so an empty result still reports page 1 of 1 instead of page 1 of 0.</li>
          <li><code>setPageIndex</code>, <code>nextPage</code> and <code>lastPage</code> clamp into the valid range. <code>previousPage</code> stops at zero.</li>
          <li><code>setPageSize</code> resets the page index to zero, because keeping the index would jump the reader to an unrelated part of the list.</li>
          <li>Filtering resets the page index too. See <a routerLink="/filtering">Filtering</a>.</li>
          <li>
            When the stored index falls out of range because rows disappeared, the rendered page is
            clamped for that read without writing to the state. Your control keeps showing the stored
            index until the next explicit write, so read the page number from
            <code>pagination().pageIndex</code> and trust <code>rows()</code> for the content.
          </li>
        </ol>

        <h2>Starting on a different page size</h2>
      </docs-prose>

      <docs-code [code]="initial" lang="ts" title="Seeding pagination" />

      <docs-prose>
        <p>
          The default page size is <code>DEFAULT_PAGE_SIZE</code>, exported from the core entry point
          and currently ten. Server driven pagination is a different setup, covered in
          <a routerLink="/server-side">Server side data</a>.
        </p>
      </docs-prose>
    </docs-page>
  `,
})
export class PaginationPage {
  protected readonly demoHtml = DEMO_HTML;
  protected readonly sizes = [5, 10, 25, 50];

  protected readonly initial = `
import { DEFAULT_PAGE_SIZE } from '@gunerkaanalkim/cairn-datatable/core';

const table = createTable({
  data,
  columns,
  initialState: {
    pagination: { pageIndex: 0, pageSize: 25 },
  },
});

// DEFAULT_PAGE_SIZE is 10 when you do not pass one.
`;

  private readonly data = signal(EMPLOYEES);
  private readonly columns = signal(FULL_COLUMNS);

  protected readonly table = createTable({
    data: this.data,
    columns: this.columns,
    rowId: (row) => row.id,
    initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
  });

  protected setSize(value: string): void {
    this.table.setPageSize(Number(value));
  }

  protected readonly api: readonly ApiEntry[] = [
    { name: 'pagination', type: 'Signal<PaginationState>', description: 'The stored zero based page index and the page size.' },
    { name: 'pageCount', type: 'Signal<number>', description: 'Number of pages for the filtered row set. Never less than one.' },
    { name: 'setPageIndex', type: '(pageIndex: number) => void', description: 'Jumps to a page, clamped into the valid range.' },
    { name: 'setPageSize', type: '(pageSize: number) => void', description: 'Changes the page size and resets the page index to zero.' },
    { name: 'nextPage', type: '() => void', description: 'Moves one page forward, stopping on the last page.' },
    { name: 'previousPage', type: '() => void', description: 'Moves one page back, stopping on the first page.' },
    { name: 'firstPage', type: '() => void', description: 'Jumps to page index zero.' },
    { name: 'lastPage', type: '() => void', description: 'Jumps to the last page.' },
    { name: 'rows', type: 'Signal<readonly Row<T>[]>', description: 'The current page. This is what you render.' },
    { name: 'sortedRows', type: 'Signal<readonly Row<T>[]>', description: 'Every filtered and sorted row, before the page slice.' },
  ];
}
