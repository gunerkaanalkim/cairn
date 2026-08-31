# Filtering

Live demo: [https://gunerkaanalkim.github.io/cairn/filtering](https://gunerkaanalkim.github.io/cairn/filtering)

One global query across the visible columns, one query per column, and a predicate you can replace at either level.

Both filter kinds are applied in the same stage. A row survives when every non-empty column filter matches and at least one globally filterable column matches the global query. There is no debounce inside the library, so wire the input straight to `setGlobalFilter` or debounce it yourself.

## Filtering API

1. `globalFilter` - `Signal<string>`. The current global query. An empty string means no global filtering.
2. `columnFilters` - `Signal<Readonly<Record<string, string>>>`. Query per column id. Empty values are kept in the record but skipped while filtering.
3. `setGlobalFilter` - `(query: string) => void`. Replaces the global query and resets the page index to zero.
4. `setColumnFilter` - `(columnId: string, query: string) => void`. Replaces the query for one column and resets the page index to zero.
5. `clearFilters` - `() => void`. Clears the global query and every column query, then resets the page index.
6. `filteredRowCount` - `Signal<number>`. Number of rows surviving the filters, before pagination.
7. `totalRowCount` - `Signal<number>`. Number of source rows, ignoring every filter.

## Example

```typescript
const columns: ColumnDef<Employee>[] = [
  { id: 'name', header: 'Name' },
  { id: 'email', header: 'Email' },
  { id: 'department', header: 'Department' },
  {
    id: 'projects',
    header: 'Projects',
    align: 'end',
    // Understands ">10", "<5" and a plain number.
    filterFn: (value, query) => {
      const count = Number(value);
      const trimmed = query.trim();
      if (trimmed.startsWith('>')) return count > Number(trimmed.slice(1));
      if (trimmed.startsWith('<')) return count < Number(trimmed.slice(1));
      return String(count) === trimmed;
    },
  },
  {
    id: 'id',
    header: 'ID',
    align: 'end',
    // An internal identifier should not pollute the global search.
    globallyFilterable: false,
  },
];
```

```html
<input placeholder="Search everything" (input)="table.setGlobalFilter($any($event.target).value)" />
<input placeholder="Department" (input)="table.setColumnFilter('department', $any($event.target).value)" />
<button (click)="table.clearFilters()">Clear filters</button>

<cairn-data-table [table]="table" />
```

## The default predicate

1. A `null` or `undefined` value never matches.
2. Everything else is compared as `String(value).toLowerCase().includes(query.toLowerCase())`.
3. The predicate sees the raw accessor value, not the formatted text. A column that reads as `31 Aug 2026` is still searched as `2026-08-31`, which is exactly when a custom `filterFn` earns its place.

## Precedence

A column-level `filterFn` wins over the table-level `filterFn`, which wins over the built-in predicate. The same function is used for the column filter and for that column's contribution to the global filter.

## Two behaviours worth knowing

1. Filtering only scans visible columns. Hiding a column removes it from the global search and suspends its column filter until it is shown again. See [Column visibility](column-visibility.md).
2. Every filter write resets the page index to zero. Without it you would routinely land on an empty page four of a two-page result.

## A table-wide predicate

```typescript
const table = createTable({
  data,
  columns,
  // Word prefix matching instead of a substring match.
  filterFn: (value, query) =>
    String(value)
      .toLowerCase()
      .split(/\s+/)
      .some((word) => word.startsWith(query.toLowerCase())),
});
```

A table-level `filterFn` replaces the default for every column that does not define its own. It receives only the value and the query, while a column-level predicate also receives the row, which is what you need when the decision depends on a second field.
