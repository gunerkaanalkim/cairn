# State and persistence

Live demo: [https://gunerkaanalkim.github.io/cairn/state](https://gunerkaanalkim.github.io/cairn/state)

Six pieces of state, one snapshot signal and one setter. Saving a view is a serialisation problem, not an API (Application Programming Interface) problem.

Everything the table remembers lives in `state()`: `sorting`, `globalFilter`, `columnFilters`, `pagination`, `selection` and `hiddenColumns`. Each is also exposed as its own signal, so a control can subscribe to just the slice it renders.

## State API

1. `state` - `Signal<TableState>`. Snapshot of all six slices. A computed signal, so it recomputes when any slice changes.
2. `setState` - `(state: Partial<TableState>) => void`. Writes the keys you provide and leaves the rest untouched. Applies no clamping or validation.
3. `initialState` - `Partial<TableState>` createTable option. Seeds the same six slices before the first render.
4. `sorting` - `Signal<readonly SortState[]>`.
5. `globalFilter` - `Signal<string>`.
6. `columnFilters` - `Signal<Readonly<Record<string, string>>>`.
7. `pagination` - `Signal<PaginationState>`.
8. `selection` - `Signal<ReadonlySet<RowId>>`.

## Serialisation

Two fields are `Set` objects, and `JSON.stringify` turns a `Set` into `{}` without complaining. Convert both directions explicitly.

```typescript
import type { TableState, TableApi } from '@gunerkaanalkim/cairn-datatable/core';

function serialize(state: TableState): string {
  return JSON.stringify({
    ...state,
    // A Set does not survive JSON.stringify.
    selection: Array.from(state.selection),
    hiddenColumns: Array.from(state.hiddenColumns),
  });
}

function restore(table: TableApi<Employee>, raw: string): void {
  const parsed = JSON.parse(raw);
  table.setState({
    ...parsed,
    selection: new Set(parsed.selection),
    hiddenColumns: new Set(parsed.hiddenColumns),
  });
}
```

## setState is a partial write

1. Only the keys you pass are written. Omitted keys keep their current value, they are not reset.
2. It is the same shape as `initialState`, so a snapshot taken today can be fed to either one.
3. It bypasses the guards that the individual setters apply. Writing a page index past the end is allowed, and the rendered page clamps for that read.

## Reacting to state changes

`state()` is a plain computed signal, so an `effect` is all you need to sync it to a query string, to `localStorage` or to a server. Persisting on every keystroke is rarely what you want, so debounce or persist on navigation.

```typescript
effect(() => {
  const state = this.table.state();
  // Runs whenever any slice of the state changes.
  this.router.navigate([], {
    queryParams: { q: state.globalFilter || null, page: state.pagination.pageIndex || null },
    queryParamsHandling: 'merge',
    replaceUrl: true,
  });
});
```

When the server owns sorting, filtering or paging, the same state drives your request. See [Server-side data](server-side.md).
