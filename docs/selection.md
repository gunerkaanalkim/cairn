# Selection

Live demo: [https://gunerkaanalkim.github.io/cairn/selection](https://gunerkaanalkim.github.io/cairn/selection)

A set of row identities that survives paging, sorting and filtering, plus a header checkbox scoped to the visible page.

Setting `selectable` on the component adds a checkbox column in front of the data columns. The core layer does not need the component at all, the same methods drive a checkbox you render yourself.

## Selection API

1. `selectable` - `boolean` component input, default `false`. Renders the checkbox column in `cairn-data-table`.
2. `selection` - `Signal<ReadonlySet<RowId>>`. The raw set of selected row identities.
3. `selectedRows` - `Signal<readonly T[]>`. Source objects for every selected identity, across all pages and regardless of the active filters.
4. `toggleRowSelection` - `(rowId: RowId) => void`. Flips one row.
5. `setRowSelected` - `(rowId: RowId, selected: boolean) => void`. Sets one row to an explicit state. The right call inside a loop.
6. `isRowSelected` - `(rowId: RowId) => boolean`. Reads one row.
7. `toggleAllPageRows` - `() => void`. Selects every row on the current page, or deselects them when they are already all selected.
8. `allPageRowsSelected` - `Signal<boolean>`. True when the current page is non-empty and fully selected.
9. `somePageRowsSelected` - `Signal<boolean>`. True when the page is partially selected. Drives the indeterminate checkbox.
10. `clearSelection` - `() => void`. Empties the selection.

## Example

```typescript
const table = createTable({
  data,
  columns,
  // Selection is keyed by this value. Without it the key is the array index.
  rowId: (row) => row.id,
});
```

```html
<cairn-data-table [table]="table" [selectable]="true" />

<p>{{ table.selectedRows().length }} selected</p>
<button (click)="table.clearSelection()">Clear</button>
```

## Identity is everything

The selection is a `Set` of row identities produced by `rowId`. The default identity is the array index, which means a re-sorted or replaced array keeps the same selected positions rather than the same selected rows. Pass a real key and this whole class of bug disappears.

## Page scope versus result scope

1. `toggleAllPageRows` only touches the rows currently rendered. If every one of them is already selected it deselects them, otherwise it selects them all.
2. `allPageRowsSelected` and `somePageRowsSelected` drive the header checkbox and its indeterminate state. Both are scoped to the page.
3. `selectedRows` is the opposite: it returns the source objects for every selected identity, whether or not those rows are on the page or even pass the current filter.

To select everything the filters left behind, walk `sortedRows()` rather than `rows()`.

```typescript
selectAllFiltered(): void {
  // sortedRows is every filtered row, not just the current page.
  for (const row of this.table.sortedRows()) {
    this.table.setRowSelected(row.id, true);
  }
}
```

## Seeding and restoring

`initialState.selection` takes a `Set`. When persisting it to `localStorage`, convert with `Array.from` and back, since a `Set` does not survive `JSON.stringify`. See [State and persistence](state.md).
