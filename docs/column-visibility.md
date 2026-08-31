# Column visibility

Live demo: [https://gunerkaanalkim.github.io/cairn/column-visibility](https://gunerkaanalkim.github.io/cairn/column-visibility)

Hiding a column is state, not configuration. It changes what renders and what the filters can see.

## Visibility API

1. `allColumns` - `Signal<readonly ColumnDef<T>[]>`. Every column with its `hidden` flag resolved from the current state. Use it to build a picker.
2. `visibleColumns` - `Signal<readonly ColumnDef<T>[]>`. Columns that are not hidden, in declaration order. This is what renders and what filtering scans.
3. `setColumnVisibility` - `(columnId: string, visible: boolean) => void`. Sets one column to an explicit visibility.
4. `toggleColumnVisibility` - `(columnId: string) => void`. Flips one column.
5. `isColumnVisible` - `(columnId: string) => boolean`. Reads one column. Returns `false` for an unknown column id.

## A column picker

```html
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
```

## How it interacts with the rest

1. `visibleColumns()` is what the component renders and what the filter stage scans. Hiding a column therefore removes it from the global search and suspends its column filter.
2. Sorting is unaffected. A sort on a hidden column keeps working, which is what you want when a column is hidden purely for width.
3. `allColumns()` returns every column with its `hidden` flag resolved from the current state. It is the correct source for a column picker.
4. The `hidden` flag on a `ColumnDef` is only read once, on the first render, and only when `initialState.hiddenColumns` was not supplied.

## Two ways to start with a hidden column

```typescript
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
```

Persisting the picker is the same `Set` round trip described in [State and persistence](state.md).
