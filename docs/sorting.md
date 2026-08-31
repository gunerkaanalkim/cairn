# Sorting

Live demo: [https://gunerkaanalkim.github.io/cairn/sorting](https://gunerkaanalkim.github.io/cairn/sorting)

## The click cycle

1. First activation sorts ascending.
2. Second activation sorts descending.
3. Third activation removes the column from the sort.

Holding Shift while clicking, or pressing Shift together with Enter, appends the column to the existing sort instead of replacing it. That additive path is only taken when `multiSort` is left at its default of `true`.

## Sorting API

1. `sorting` - `Signal<readonly SortState[]>`. Ordered list of active sorts. The first entry is the primary sort.
2. `toggleSort` - `(columnId: string, additive?: boolean) => void`. Cycles ascending, descending, unsorted. With `additive` true and `multiSort` enabled the column joins the existing sort.
3. `setSorting` - `(sorting: readonly SortState[]) => void`. Replaces the sort state. Entries for columns with `sortable: false` are dropped.
4. `clearSorting` - `() => void`. Removes every sort. This is also what Escape does on a focused header button.
5. `sortedRows` - `Signal<readonly Row<T>[]>`. Filtered and sorted rows before pagination. Useful for exports and for selecting all rows across pages.

## Example

```typescript
const ROLE_ORDER = ['Owner', 'Admin', 'Editor', 'Viewer'];

const columns: ColumnDef<Employee>[] = [
  { id: 'name', header: 'Name' },
  {
    id: 'role',
    header: 'Role',
    // Sorts by seniority instead of alphabetically.
    sortFn: (a, b) => ROLE_ORDER.indexOf(String(a)) - ROLE_ORDER.indexOf(String(b)),
  },
  { id: 'projects', header: 'Projects', align: 'end' },
];

const table = createTable({
  data,
  columns: signal(columns),
  rowId: (row) => row.id,
  multiSort: true,
  initialState: { sorting: [{ id: 'role', direction: 'asc' }] },
});
```

```html
<cairn-data-table [table]="table" />

<button (click)="table.setSorting([{ id: 'projects', direction: 'desc' }])">
  Most projects first
</button>
<button (click)="table.clearSorting()">Clear</button>
```

## Comparator rules

1. A column-level `sortFn` wins over the table-level `sortFn`, which in turn wins over the built-in comparator.
2. The built-in comparator subtracts two numbers and falls back to `localeCompare` on the string form of anything else.
3. The comparator always receives the raw value from the accessor, never the formatted text.
4. Return a positive, negative or zero number in ascending order. The library inverts the result for a descending sort, so a comparator never needs to know the direction.
5. `null` and `undefined` are handled before your comparator runs and always sink to the bottom, in both directions.
6. Rows that compare equal keep their original order, because ties fall back to the source index.

## Sorting a date column

```typescript
{
  id: 'joinedAt',
  header: 'Joined',
  // The raw value is an ISO string, so a plain comparison is chronological.
  sortFn: (a, b) => String(a).localeCompare(String(b)),
  // Only the rendered text changes, the sort still sees the ISO string.
  formatter: (value) => new Date(String(value)).toLocaleDateString('en-GB'),
}
```

## Reading and writing the state

`sorting()` is an ordered list. The first entry is the primary sort, the rest are tie breakers applied in order. Writing it directly with `setSorting` is the simplest way to restore a saved view or to expose your own sort control.

`setSorting` drops any entry that points at a column with `sortable: false`, so a stale saved view cannot re-enable a sort you disabled.
