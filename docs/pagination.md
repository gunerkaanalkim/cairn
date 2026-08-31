# Pagination

Live demo: [https://gunerkaanalkim.github.io/cairn/pagination](https://gunerkaanalkim.github.io/cairn/pagination)

A page index, a page size, and six methods that can never move you outside the valid range.

The library renders no pagination control. It exposes the state and the arithmetic, you render the buttons.

## Pagination API

1. `pagination` - `Signal<PaginationState>`. The stored zero-based page index and the page size.
2. `pageCount` - `Signal<number>`. Number of pages for the filtered row set. Never less than one.
3. `setPageIndex` - `(pageIndex: number) => void`. Jumps to a page, clamped into the valid range.
4. `setPageSize` - `(pageSize: number) => void`. Changes the page size and resets the page index to zero.
5. `nextPage` - `() => void`. Moves one page forward, stopping on the last page.
6. `previousPage` - `() => void`. Moves one page back, stopping on the first page.
7. `firstPage` - `() => void`. Jumps to page index zero.
8. `lastPage` - `() => void`. Jumps to the last page.
9. `rows` - `Signal<readonly Row<T>[]>`. The current page. This is what you render.
10. `sortedRows` - `Signal<readonly Row<T>[]>`. Every filtered and sorted row, before the page slice.

## A complete pager

```html
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
```

## Guarantees

1. `pageCount()` is never below one, so an empty result still reports page 1 of 1 instead of page 1 of 0.
2. `setPageIndex`, `nextPage` and `lastPage` clamp into the valid range. `previousPage` stops at zero.
3. `setPageSize` resets the page index to zero, because keeping the index would jump the reader to an unrelated part of the list.
4. Filtering resets the page index too. See [Filtering](filtering.md).
5. When the stored index falls out of range because rows disappeared, the rendered page is clamped for that read without writing to the state. Your control keeps showing the stored index until the next explicit write, so read the page number from `pagination().pageIndex` and trust `rows()` for the content.

## Seeding pagination

```typescript
import { DEFAULT_PAGE_SIZE } from '@gunerkaanalkim/cairn-datatable/core';

const table = createTable({
  data,
  columns,
  initialState: {
    pagination: { pageIndex: 0, pageSize: 25 },
  },
});

// DEFAULT_PAGE_SIZE is 10 when you do not pass one.
```

Server-driven pagination is a different setup, covered in [Server-side data](server-side.md).
