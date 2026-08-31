# Core concepts

Live demo: [https://gunerkaanalkim.github.io/cairn/concepts](https://gunerkaanalkim.github.io/cairn/concepts)

Four ideas explain the whole library: two entry points, a derivation chain, stable row identity, and state you fully own.

## Two entry points

1. `@gunerkaanalkim/cairn-datatable/core` contains no component and no template. It exports `createTable`, the type definitions and three default constants. It depends on Angular signals and nothing else, so it never touches the DOM (Document Object Model).
2. `@gunerkaanalkim/cairn-datatable` re-exports everything from the core entry point and adds `DataTable`, the four template directives, the `CellContext` interface and the `CairnClassNames` interface.

```typescript
// Logic only. No component, no template, no DOM.
import { createTable, type TableApi } from '@gunerkaanalkim/cairn-datatable/core';

// Component layer. Re-exports everything above.
import { DataTable, CairnCell, type CairnClassNames } from '@gunerkaanalkim/cairn-datatable';
```

Use the root entry point when you want a rendered table. Import only the core entry point when you render the rows yourself, which keeps the component out of your bundle. See [Headless usage](headless.md).

## The derivation chain

`createTable` builds one `computed` per stage. Each stage depends only on the stage before it and on the state signals it needs, so changing the page index recomputes pagination alone and leaves the sorted result untouched.

1. `data()` - the rows you own. Any signal or plain getter.
2. `baseRows` - rows wrapped with a stable identity and a source index.
3. `filteredRows` - the global filter and the column filters applied.
4. `sortedRows` - the multi-column sort applied, ties broken by source index.
5. `rows` - the current page, with the selection flag merged in.

`sortedRows` is exposed on purpose. It is the full result set after filtering and sorting but before pagination, which is what an export or a "select all across pages" action needs.

## Row identity

Every row is wrapped in a `Row<T>` object carrying an `id`, the original `data` reference, the `sourceIndex` in the input array and a `selected` flag. The original object is never cloned and never mutated.

The default `rowId` is the array index. That is fine for a static list, but as soon as the data can be re-sorted, paged from a server or reordered, pass a real identity. Selection is keyed by this value, so an index-based identity silently selects the wrong rows after the array changes.

```typescript
const table = createTable({
  data: this.data,
  columns: this.columns,

  // Without this the row id is the array index, which breaks
  // selection as soon as the underlying array is replaced.
  rowId: (row) => row.id,
});
```

## You own the state

The table keeps six pieces of state: sorting, global filter, column filters, pagination, selection and hidden columns. Each one is readable as a signal, writable through a method, and readable as a whole through `state()`. Nothing is stored anywhere else, so restoring a saved view is a single `setState` call. See [State and persistence](state.md).

## createTable options at a glance

1. `data` - `() => readonly T[]`. Required. Reactive source of rows.
2. `columns` - `() => readonly ColumnDef<T>[]`. Required. Reactive source of column definitions.
3. `rowId` - `(row: T, index: number) => string | number`. Defaults to the array index.
4. `initialState` - `Partial<TableState>`. Seeds any of the six state slices before the first render.
5. `multiSort` - `boolean`, default `true`. Allows more than one active sort column.
6. `sortFn` - `(a: unknown, b: unknown) => number`. Fallback comparator for every column without its own `sortFn`.
7. `filterFn` - `(value: unknown, query: string) => boolean`. Fallback predicate for every column without its own `filterFn`.
8. `manual` - `{ sorting?: boolean; filtering?: boolean; pagination?: boolean }`. Disables individual pipeline stages so a server can own them.

The [API reference](api-reference.md) documents each option in full.
