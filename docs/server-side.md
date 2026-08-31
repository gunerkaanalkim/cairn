# Server-side data

Live demo: [https://gunerkaanalkim.github.io/cairn/server-side](https://gunerkaanalkim.github.io/cairn/server-side)

Switch off the pipeline stages the server owns. The table keeps tracking the state, it simply stops applying it.

The `manual` option takes three independent flags. Turning one on means the matching stage passes the rows through untouched, while the state signal behind it keeps working normally. That is exactly what you want: the state becomes the description of the request you need to send.

## Manual mode

1. `manual.sorting` - `boolean`, default `false`. Skips the sort stage. `sorting()` still records what the user asked for, so you can forward it.
2. `manual.filtering` - `boolean`, default `false`. Skips the filter stage. `globalFilter()` and `columnFilters()` keep tracking the queries.
3. `manual.pagination` - `boolean`, default `false`. Skips the page slice, so every row you supply is rendered. `pagination()` keeps the requested page.
4. `loading` - `boolean` component input, default `false`. Renders the loading state and sets `aria-busy` on the `tbody` while a request is in flight.
5. `data` - `() => readonly T[]` createTable option. Under manual mode this is the current page returned by the server, not the whole set.

## Example

```typescript
const rows = signal<Employee[]>([]);
const total = signal(0);
const loading = signal(false);

const table = createTable({
  data: rows,
  columns,
  rowId: (row) => row.id,
  // The server owns all three stages. The state is still tracked.
  manual: { sorting: true, filtering: true, pagination: true },
  initialState: { pagination: { pageIndex: 0, pageSize: 6 } },
});

effect(() => {
  // Every slice this reads becomes a trigger for a new request.
  const query = table.globalFilter();
  const sort = table.sorting()[0];
  const { pageIndex, pageSize } = table.pagination();

  loading.set(true);
  http.get<PageResult>('/api/members', {
    params: {
      q: query,
      sort: sort?.id ?? '',
      direction: sort?.direction ?? '',
      page: pageIndex,
      size: pageSize,
    },
  }).subscribe((result) => {
    rows.set(result.rows);
    total.set(result.total);
    loading.set(false);
  });
});

// pageCount() would describe the single page you were handed,
// so the pager reads the server total instead.
const pageCount = computed(() => Math.max(1, Math.ceil(total() / table.pagination().pageSize)));
```

## The one thing to watch

`pageCount()` and `filteredRowCount()` are derived from the rows you hand the table. Under manual pagination that is a single page, so both report the page, not the result set. Keep the server's total in your own signal and drive the pager from it, as the example above does.

The same applies to `previousPage`, `nextPage` and `lastPage`: they clamp against the table's idea of the page count. With manual pagination, either supply your own guards or use `setPageIndex` directly.

## Mixing modes

1. Server-side filtering with client-side sorting is a common pairing when the page is small: set `filtering` and `pagination` to `true` and leave sorting off.
2. Client-side everything with a server-side refresh needs no manual flags at all. Write the new array to your data signal and the whole chain re-derives.
3. A column with `filterable: false` still stores its query, which is handy when the query is only ever meant for the server.

## Debouncing

The library never debounces. Wire the effect that issues the request through your own timer, or read the filter from a form control with `debounceTime`. Reading `state()` inside an effect gives you one trigger for every slice at once.

The state shape is documented in [State and persistence](state.md).
