import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { TableApi } from '@gunerkaanalkim/cairn-datatable/core';

/**
 * Pagination and selection footer reused by the demos.
 * The pagination page documents this markup line by line.
 */
@Component({
  selector: 'docs-pager',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mt-4 flex flex-wrap items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
      <button
        type="button"
        class="focus-ring rounded-md border border-zinc-200 px-2.5 py-1 disabled:opacity-40 hover:enabled:bg-zinc-100 dark:border-zinc-700 dark:hover:enabled:bg-zinc-800"
        [disabled]="table().pagination().pageIndex === 0"
        (click)="table().previousPage()"
      >
        Previous
      </button>
      <span class="tabular-nums">
        Page {{ table().pagination().pageIndex + 1 }} of {{ table().pageCount() }}
      </span>
      <button
        type="button"
        class="focus-ring rounded-md border border-zinc-200 px-2.5 py-1 disabled:opacity-40 hover:enabled:bg-zinc-100 dark:border-zinc-700 dark:hover:enabled:bg-zinc-800"
        [disabled]="table().pagination().pageIndex >= table().pageCount() - 1"
        (click)="table().nextPage()"
      >
        Next
      </button>
      <span class="ml-auto tabular-nums">
        {{ table().filteredRowCount() }} of {{ table().totalRowCount() }} rows
        @if (showSelection()) {
          <span> · {{ table().selectedRows().length }} selected</span>
        }
      </span>
    </div>
  `,
})
export class DemoPager<T> {
  readonly table = input.required<TableApi<T>>();
  readonly showSelection = input<boolean>(false);
}
