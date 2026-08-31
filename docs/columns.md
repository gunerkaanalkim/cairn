# Columns

Live demo: [https://gunerkaanalkim.github.io/cairn/columns](https://gunerkaanalkim.github.io/cairn/columns)

A column definition is a plain object. It decides where a value comes from, how it reads on screen and which pipeline stages may touch it.

Only `id` and `header` are required. The `id` is the accessor key by default, the identity published as `data-column-id`, and the key you pass to `setColumnFilter`, `toggleSort` and the template directives, so keep it unique and stable.

## ColumnDef fields

1. `id` - `string`. Required. Unique identifier, default accessor key, and the value published as `data-column-id`.
2. `header` - `string`. Required. Text rendered in the header cell when no `cairnHeader` template overrides it.
3. `accessor` - `(row: T) => unknown`. Defaults to `(row) => row[id]`. Extracts the raw value. Sorting, filtering and `cellValue` all read through it.
4. `formatter` - `(value: unknown, row: T) => string`. Defaults to `String(value)`, and an empty string for `null` and `undefined`. Converts the raw value into display text. Affects `cellText` only, never sorting or filtering.
5. `sortable` - `boolean`, default `true`. When `false` the header renders as plain text with no button and the column cannot be sorted.
6. `filterable` - `boolean`, default `true`. When `false` the per-column filter for this column is ignored.
7. `globallyFilterable` - `boolean`, default `true`. When `false` the column is skipped while scanning for a global filter match.
8. `hidden` - `boolean`, default `false`. Hides the column on first render. Ignored when `initialState.hiddenColumns` is provided.
9. `align` - `'start' | 'center' | 'end'`, default `'start'`. Published as `data-align` on the header cell and every body cell. The shipped stylesheet turns it into text alignment.
10. `sortFn` - `(a: unknown, b: unknown, rowA: T, rowB: T) => number`. Custom comparator for this column. Receives raw values, not formatted text. The direction is applied afterwards.
11. `filterFn` - `(value: unknown, query: string, row: T) => boolean`. Custom predicate for this column. Used by both the column filter and the global filter.
12. `meta` - `Readonly<Record<string, unknown>>`. Arbitrary consumer data. The library never reads it, your template code can.

## Example

```typescript
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
```

## Accessor or formatter?

1. `accessor` changes the value. Sorting, filtering and `cellValue` all see whatever it returns.
2. `formatter` changes the text. It runs last and only affects `cellText`, so a date still sorts chronologically while it reads as `31 Aug 2026`.

That separation is the reason a currency column sorts numerically without any extra comparator: format the number, do not stringify it in the accessor.

## Turning stages off per column

1. `sortable: false` removes the header button entirely and makes `toggleSort` a no-op for that column. `setSorting` silently drops entries pointing at it.
2. `filterable: false` makes `setColumnFilter` store the query but never apply it.
3. `globallyFilterable: false` keeps the column out of the global filter scan, which is what you want for an internal identifier.
4. `hidden: true` is only read on the first render, and only when `initialState.hiddenColumns` was not supplied. After that, visibility is state, not configuration. See [Column visibility](column-visibility.md).

## Changing columns at runtime

`columns` is an accessor, so writing a new array to the signal re-derives everything. Filters and sorts pointing at a removed column stay in state but stop matching, which keeps a restored view from throwing.

For per-column rendering rather than per-column values, see [Templates](templates.md).
