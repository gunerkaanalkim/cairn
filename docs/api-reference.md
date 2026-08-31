# API reference

Live demo: [https://gunerkaanalkim.github.io/cairn/api](https://gunerkaanalkim.github.io/cairn/api)

Every export, with its exact signature and the behaviour behind it. API stands for Application Programming Interface.

## Entry points

1. `@gunerkaanalkim/cairn-datatable/core` exports `createTable`, the three default constants and every type. No component, no DOM (Document Object Model).
2. `@gunerkaanalkim/cairn-datatable` re-exports all of the above and adds `DataTable`, `CairnCell`, `CairnHeader`, `CairnEmpty`, `CairnLoading`, `CellContext` and `CairnClassNames`.
3. `@gunerkaanalkim/cairn-datatable/styles/cairn-datatable.css` is the optional stylesheet.

## createTable

```typescript
function createTable<T>(options: TableOptions<T>): TableApi<T>;
```

### TableOptions

1. `data` - `() => readonly T[]`. Required. Reactive source of rows.
2. `columns` - `() => readonly ColumnDef<T>[]`. Required. Reactive source of column definitions.
3. `rowId` - `(row: T, index: number) => RowId`. Default `(row, index) => index`. Stable row identity. Selection is keyed by it, so an index-based default breaks when the array is replaced.
4. `initialState` - `Partial<TableState>`. Default `{}`. Seeds any of the six state slices before the first render.
5. `multiSort` - `boolean`. Default `true`. Allows several active sort columns. When `false`, an additive toggle replaces the sort instead of appending.
6. `sortFn` - `(a: unknown, b: unknown) => number`. Default: numeric for numbers, `localeCompare` otherwise. Table-wide fallback comparator.
7. `filterFn` - `(value: unknown, query: string) => boolean`. Default: case-insensitive substring match. Table-wide fallback predicate.
8. `manual` - `{ sorting?: boolean; filtering?: boolean; pagination?: boolean }`. Default `{}`. Disables individual pipeline stages while still tracking their state.

## ColumnDef

1. `id` - `string`. Required. Unique identifier, default accessor key, and the value published as `data-column-id`.
2. `header` - `string`. Required. Header text when no `cairnHeader` template applies.
3. `accessor` - `(row: T) => unknown`. Default `(row) => row[id]`. Extracts the raw value used by sorting, filtering, `cellValue` and `cellText`.
4. `formatter` - `(value: unknown, row: T) => string`. Default `String(value)`, empty string for nullish. Display text only. Never affects sorting or filtering.
5. `sortable` - `boolean`. Default `true`. When `false` the header renders without a button and `toggleSort` ignores the column.
6. `filterable` - `boolean`. Default `true`. When `false` the stored column filter is never applied.
7. `globallyFilterable` - `boolean`. Default `true`. When `false` the column is skipped during the global filter scan.
8. `hidden` - `boolean`. Default `false`. Hidden on first render. Ignored entirely when `initialState.hiddenColumns` is supplied.
9. `align` - `ColumnAlign`. Default `'start'`. Published as `data-align`. The shipped stylesheet maps it to text alignment.
10. `sortFn` - `(a: unknown, b: unknown, rowA: T, rowB: T) => number`. Column comparator. Receives raw values in ascending order, the direction is applied afterwards.
11. `filterFn` - `(value: unknown, query: string, row: T) => boolean`. Column predicate. Used by both the column filter and the global filter.
12. `meta` - `Readonly<Record<string, unknown>>`. Arbitrary consumer data. Never read by the library.

## TableApi, derived data

1. `rows` - `Signal<readonly Row<T>[]>`. Filtered, sorted and paginated rows with the selection flag merged in. This is what you render.
2. `sortedRows` - `Signal<readonly Row<T>[]>`. Filtered and sorted rows before the page slice.
3. `visibleColumns` - `Signal<readonly ColumnDef<T>[]>`. Columns that are not hidden, in declaration order. Also the set that filtering scans.
4. `allColumns` - `Signal<readonly ColumnDef<T>[]>`. Every column with the `hidden` flag resolved from the current state.
5. `totalRowCount` - `Signal<number>`. Number of source rows.
6. `filteredRowCount` - `Signal<number>`. Number of rows surviving the filters.
7. `pageCount` - `Signal<number>`. `Math.max(1, ceil(filteredRowCount / pageSize))`.
8. `isEmpty` - `Signal<boolean>`. True when the current page has no rows.
9. `selectedRows` - `Signal<readonly T[]>`. Source objects for every selected identity, across pages and regardless of filters.
10. `allPageRowsSelected` - `Signal<boolean>`. True when the page is non-empty and every row on it is selected.
11. `somePageRowsSelected` - `Signal<boolean>`. True when the page is partially selected. Drives the indeterminate header checkbox.

## TableApi, state signals

1. `sorting` - `Signal<readonly SortState[]>`. Ordered sort entries, primary sort first.
2. `globalFilter` - `Signal<string>`. The global query.
3. `columnFilters` - `Signal<Readonly<Record<string, string>>>`. Query per column id. Empty values are kept but skipped.
4. `pagination` - `Signal<PaginationState>`. Stored page index and page size. The rendered page may be clamped without changing this value.
5. `selection` - `Signal<ReadonlySet<RowId>>`. Selected row identities.
6. `state` - `Signal<TableState>`. All six slices as one snapshot.

## TableApi, methods

1. `toggleSort(columnId: string, additive?: boolean): void` - cycles ascending, descending, unsorted. Additive appends only when `multiSort` is enabled.
2. `setSorting(sorting: readonly SortState[]): void` - replaces the sort state, dropping entries for columns with `sortable: false`.
3. `clearSorting(): void` - removes every sort.
4. `setGlobalFilter(query: string): void` - sets the global query and resets the page index to zero.
5. `setColumnFilter(columnId: string, query: string): void` - sets one column query and resets the page index to zero.
6. `clearFilters(): void` - clears every filter and resets the page index.
7. `setPageIndex(pageIndex: number): void` - jumps to a page, clamped into range.
8. `setPageSize(pageSize: number): void` - changes the page size and resets the page index to zero.
9. `nextPage(): void` - forward one page, clamped at the last page.
10. `previousPage(): void` - back one page, stopping at zero.
11. `firstPage(): void` - jumps to page index zero.
12. `lastPage(): void` - jumps to the last page.
13. `toggleRowSelection(rowId: RowId): void` - flips one row.
14. `setRowSelected(rowId: RowId, selected: boolean): void` - sets one row explicitly.
15. `isRowSelected(rowId: RowId): boolean` - reads one row.
16. `toggleAllPageRows(): void` - selects the whole page, or clears it when already fully selected.
17. `clearSelection(): void` - empties the selection.
18. `setColumnVisibility(columnId: string, visible: boolean): void` - shows or hides one column.
19. `toggleColumnVisibility(columnId: string): void` - flips one column.
20. `isColumnVisible(columnId: string): boolean` - reads one column. `false` for an unknown id.
21. `cellValue(row: Row<T>, columnId: string): unknown` - raw accessor value. `undefined` for an unknown column id.
22. `cellText(row: Row<T>, columnId: string): string` - formatted display text. Empty string for an unknown column id or a nullish value.
23. `setState(state: Partial<TableState>): void` - writes only the keys provided. Applies no clamping.

## Supporting types

```typescript
type RowId = string | number;
type SortDirection = 'asc' | 'desc';
type ColumnAlign = 'start' | 'center' | 'end';
type Accessor<TValue> = () => TValue;

interface Row<T> {
  readonly id: RowId;           // from TableOptions.rowId
  readonly sourceIndex: number; // index in the original array, not on the page
  readonly data: T;             // never cloned, never mutated
  readonly selected: boolean;
}

interface SortState {
  readonly id: string;
  readonly direction: SortDirection;
}

interface PaginationState {
  readonly pageIndex: number; // zero based
  readonly pageSize: number;  // greater than zero
}

interface TableState {
  readonly sorting: readonly SortState[];
  readonly globalFilter: string;
  readonly columnFilters: Readonly<Record<string, string>>;
  readonly pagination: PaginationState;
  readonly selection: ReadonlySet<RowId>;
  readonly hiddenColumns: ReadonlySet<string>;
}

interface CellContext<T> {
  readonly $implicit: unknown; // raw accessor value
  readonly row: T;
  readonly columnId: string;
}
```

## Constants

1. `DEFAULT_PAGE_SIZE` - `number`, value `10`. Page size used when `initialState.pagination` is not supplied.
2. `DEFAULT_EMPTY_MESSAGE` - `string`, value `'No records found'`. Default value of the `emptyMessage` input.
3. `DEFAULT_SORT_CYCLE` - `readonly ['asc', 'desc', null]`. The order `toggleSort` walks through.

## DataTable component

Selector `cairn-data-table`. Standalone, `OnPush`, and it renders a block-level host element.

### Inputs

1. `table` - `TableApi<T>`. Required. The object returned by `createTable`.
2. `classNames` - `CairnClassNames`. Default `{}`. Class names appended per element. Nineteen keys, all optional. See [Styling](styling.md).
3. `caption` - `string`. Default `''`. Renders a `caption` element. Empty means no caption.
4. `loading` - `boolean`. Default `false`. Replaces the body with the loading state and sets `aria-busy` on the `tbody`.
5. `emptyMessage` - `string`. Default `DEFAULT_EMPTY_MESSAGE`. Text shown when the page is empty and no `cairnEmpty` template is provided.
6. `selectable` - `boolean`. Default `false`. Adds the checkbox column and the select all header checkbox.

## Template directives

1. `cairnCell` - `ng-template`, optional column id. Overrides body cell content. Context: `$implicit` raw value, `row`, `columnId`. A column-specific template wins over a generic one.
2. `cairnHeader` - `ng-template`, optional column id. Overrides header content. Context: `$implicit` is the `ColumnDef`. Rendered inside the sort button when sortable.
3. `cairnEmpty` - `ng-template`. Overrides the empty state cell. No context.
4. `cairnLoading` - `ng-template`. Overrides the loading state cell. No context.

## Rendered markup

```html
<cairn-data-table class="cairn-root">
  <table class="cairn-table">
    <caption>...</caption>
    <thead class="cairn-thead">
      <tr class="cairn-header-row">
        <th class="cairn-selection-header-cell" scope="col">...</th>
        <th class="cairn-header-cell" scope="col" aria-sort data-column-id data-sorted data-align>
          <button class="cairn-header-button">
            ...
            <span class="cairn-sort-icon">up or down arrow</span>
          </button>
        </th>
      </tr>
    </thead>
    <tbody class="cairn-tbody" aria-busy>
      <tr class="cairn-row cairn-row-even" data-selected>
        <td class="cairn-selection-cell">...</td>
        <td class="cairn-cell" data-column-id data-align>...</td>
      </tr>
      <tr class="cairn-empty-row"><td class="cairn-empty-cell" colspan>...</td></tr>
      <tr class="cairn-loading-row"><td class="cairn-loading-cell" colspan>...</td></tr>
    </tbody>
  </table>
</cairn-data-table>
```

### Data attributes

1. `data-column-id` - `string`. On every header cell and body cell. The column id.
2. `data-sorted` - `'none' | 'ascending' | 'descending'`. On the header cell, mirroring `aria-sort`.
3. `data-selected` - `'true' | 'false'`. On the body row.
4. `data-align` - `'start' | 'center' | 'end'`. On the header cell and body cell, from `ColumnDef.align`.

## Not in this version

1. No virtual scrolling.
2. No column resizing.
3. No column drag and drop.
4. No row grouping and no row spanning. Row spanning is planned for version 2.
