# Headless usage

Live demo: [https://gunerkaanalkim.github.io/cairn/headless](https://gunerkaanalkim.github.io/cairn/headless)

The core entry point is the whole library minus the markup. Import it alone and render rows however you like.

`createTable` knows nothing about tables. It sorts, filters, pages and selects rows, then hands you signals. A card grid, a virtualised list, a chart legend or a mobile accordion are all the same amount of work.

Importing only `@gunerkaanalkim/cairn-datatable/core` leaves the component, its template and the four directives out of your bundle entirely.

## What you render with

1. `rows` - `Signal<readonly Row<T>[]>`. The current page. Each `Row` carries `id`, `data`, `sourceIndex` and `selected`.
2. `sortedRows` - `Signal<readonly Row<T>[]>`. Filtered and sorted rows before the page slice.
3. `visibleColumns` - `Signal<readonly ColumnDef<T>[]>`. Columns to render, in declaration order.
4. `cellValue` - `(row: Row<T>, columnId: string) => unknown`. Raw accessor value. Returns `undefined` for an unknown column id.
5. `cellText` - `(row: Row<T>, columnId: string) => string`. Formatted display text. Returns an empty string for an unknown column id.
6. `isEmpty` - `Signal<boolean>`. True when the current page has no rows.

## Example

```typescript
import { Component, signal } from '@angular/core';
// Note the /core entry point: no component, no template, no table markup.
import { createTable } from '@gunerkaanalkim/cairn-datatable/core';

@Component({
  selector: 'app-member-cards',
  template: `
    <input (input)="table.setGlobalFilter($any($event.target).value)" />

    @for (row of table.rows(); track row.id) {
      <article [class.selected]="row.selected" (click)="table.toggleRowSelection(row.id)">
        <h3>{{ table.cellText(row, 'name') }}</h3>
        <p>{{ table.cellText(row, 'role') }}</p>
      </article>
    }

    <button (click)="table.nextPage()">Next page</button>
  `,
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
```

## cellValue or cellText?

1. `cellValue` returns the raw accessor result, typed as `unknown`. Use it when you need the number, the date object or the boolean.
2. `cellText` applies the column formatter and always returns a string, with `null` and `undefined` becoming an empty string. Use it for display.
3. Both return a safe fallback for an unknown column id rather than throwing.

Nothing stops you from reading `row.data` directly, and for a hand-written view that is often clearer. The accessor pair exists so a generic renderer can stay driven by the column definitions.

## Building your own header

```html
@for (column of table.visibleColumns(); track column.id) {
  <button
    type="button"
    [attr.aria-sort]="ariaSortFor(column.id)"
    (click)="table.toggleSort(column.id, $event.shiftKey)"
  >
    {{ column.header }}
  </button>
}
```

Everything the component does is built on this API (Application Programming Interface). The [API reference](api-reference.md) lists the exact elements, classes and attributes the component emits, if you want its markup as a starting point.
