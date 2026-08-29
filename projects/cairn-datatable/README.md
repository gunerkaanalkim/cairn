# Cairn DataTable

A signal-based, zoneless datatable for Angular 21+ with zero runtime dependencies.

[![npm version](https://img.shields.io/npm/v/@gunerkaanalkim/cairn-datatable)](https://www.npmjs.com/package/@gunerkaanalkim/cairn-datatable) [![License](https://img.shields.io/npm/l/@gunerkaanalkim/cairn-datatable)](https://www.npmjs.com/package/@gunerkaanalkim/cairn-datatable) [![Minzipped Size](https://img.shields.io/bundlephobia/minzip/@gunerkaanalkim/cairn-datatable)](https://www.npmjs.com/package/@gunerkaanalkim/cairn-datatable)

**Live Demo:** [https://gunerkaanalkim.github.io/cairn/](https://gunerkaanalkim.github.io/cairn/)

### Features

1. Zero runtime dependencies.
2. Works zoneless, does not require `zone.js`.
3. Signal-based derivation chain, only the changed stage is recalculated.
4. Two layers: `core` entry for pure logic, main entry for a ready-to-use component.
5. Unopinionated styling, you can apply your own classes to every element.
6. Sorting, filtering, pagination and selection, preserving multi-page selection.
7. Template overrides for cells, headers, empty state and loading state.
8. Full keyboard navigation and screen reader support.

### Requirements

1. Angular version `^21.0.0 || ^22.0.0`.
2. Zoneless change detection is not strictly required but highly recommended.
3. Modern web browsers.

### Installation

```bash
npm install @gunerkaanalkim/cairn-datatable
```

You can import the optional default styles like this:

```css
@import '@gunerkaanalkim/cairn-datatable/styles/cairn-datatable.css';
```

If the styles are not imported, the table will be completely unstyled.

### Quick Start

```typescript
import { Component, signal } from '@angular/core';
import { createTable } from '@gunerkaanalkim/cairn-datatable/core';
import { DataTable } from '@gunerkaanalkim/cairn-datatable';

@Component({
  standalone: true,
  imports: [DataTable],
  template: `<cairn-data-table [table]="api" />`
})
export class App {
  api = createTable({
    data: signal([{id: 1, name: 'A'}]),
    columns: signal([{id: 'name', header: 'Name'}])
  });
}
```

### Two-Layer Architecture

The `@gunerkaanalkim/cairn-datatable/core` entry point contains no components. It only provides the `createTable` factory and types. It is solely dependent on Angular signals and completely agnostic to the DOM.

The main `@gunerkaanalkim/cairn-datatable` entry point provides a ready-to-use table component that consumes the output of the `createTable` factory.

You can use the core alone to build your own view without ever using the provided component. Here is a short headless usage example without using a `<table>` tag:

```typescript
import { Component } from '@angular/core';
import { createTable } from '@gunerkaanalkim/cairn-datatable/core';

@Component({
  standalone: true,
  template: `
    @for (row of table.rows(); track row.id) {
      <div class="row">
        @for (col of table.visibleColumns(); track col.id) {
          <div class="cell">{{ table.cellText(row, col.id) }}</div>
        }
      </div>
    }
  `
})
export class HeadlessExample {
  table = createTable({ /* ... */ });
}
```

### Public API Reference

1. `ColumnDef` fields:
   - `id`: `string` - Unique identifier. Also used as the default accessor key.
   - `header`: `string` - Text rendered in the header cell.
   - `accessor`: `(row: T) => unknown` - Extracts the raw value from a row.
   - `formatter`: `(value: unknown, row: T) => string` - Converts the raw value into display text.
   - `sortable`: `boolean` - Enables sorting on this column.
   - `filterable`: `boolean` - Enables the per-column filter on this column.
   - `globallyFilterable`: `boolean` - Includes this column in the global filter scan.
   - `hidden`: `boolean` - Hides the column on first render.
   - `align`: `ColumnAlign` - Horizontal alignment hint consumed by the component layer.
   - `sortFn`: `(a: unknown, b: unknown, rowA: T, rowB: T) => number` - Custom comparator.
   - `filterFn`: `(value: unknown, query: string, row: T) => boolean` - Custom predicate.
   - `meta`: `Readonly<Record<string, unknown>>` - Arbitrary consumer data.
2. `TableOptions` fields: `data`, `columns`, `rowId`, `initialState`, `multiSort`, `sortFn`, `filterFn`, `manual`.
3. `TableApi` read members: `rows`, `sortedRows`, `visibleColumns`, `allColumns`, `pageCount`, `filteredRowCount`, `totalRowCount`, `isEmpty`, `selectedRows`, `allPageRowsSelected`, `somePageRowsSelected`, `state`.
4. `TableApi` write methods:
   - Sorting: `toggleSort`, `setSorting`, `clearSorting`
   - Filtering: `setGlobalFilter`, `setColumnFilter`, `clearFilters`
   - Pagination: `setPageIndex`, `setPageSize`, `nextPage`, `previousPage`, `firstPage`, `lastPage`
   - Selection: `toggleRowSelection`, `setRowSelected`, `isRowSelected`, `toggleAllPageRows`, `clearSelection`
   - Column Visibility: `setColumnVisibility`, `toggleColumnVisibility`, `isColumnVisible`

### Customization

#### `classNames` input
The component accepts a `classNames` object. Here are the 19 keys you can use and the elements they apply to:
- `root`: Host `<cairn-data-table>` element.
- `table`: `<table>` element.
- `thead`: `<thead>` element.
- `headerRow`: `<tr>` inside thead.
- `headerCell`: `<th>` element.
- `headerCellSorted`: `<th>` element when sorted.
- `sortIcon`: Sorting icon inside `<th>`.
- `tbody`: `<tbody>` element.
- `row`: `<tr>` inside tbody.
- `rowSelected`: `<tr>` when selected.
- `rowEven`: Even `<tr>` rows.
- `rowOdd`: Odd `<tr>` rows.
- `cell`: `<td>` element.
- `selectionHeaderCell`: `<th>` containing the select all checkbox.
- `selectionCell`: `<td>` containing the row select checkbox.
- `emptyRow`: `<tr>` shown when table is empty.
- `emptyCell`: `<td>` shown when table is empty.
- `loadingRow`: `<tr>` shown when loading.
- `loadingCell`: `<td>` shown when loading.

```html
<cairn-data-table
  [table]="table"
  [classNames]="{
    table: 'min-w-full divide-y divide-gray-200',
    headerCell: 'px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
    cell: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
  }"
/>
```

#### Data Attributes
Table elements carry `data-*` attributes which you can use for pure CSS selectors without passing classes: `data-column-id`, `data-sorted`, `data-selected`, `data-align`.

```css
tr[data-selected="true"] {
  background-color: #f0f9ff;
}
```

#### Template Directives
You can override rendering using structural directives: `cairnCell`, `cairnHeader`, `cairnEmpty`, `cairnLoading`. The `cairnCell` and `cairnHeader` directives can accept a column ID; if no ID is given, they apply to all columns.

```html
<cairn-data-table [table]="table">
  <ng-template cairnCell="actions" let-row="row">
    <button (click)="edit(row)">Edit</button>
  </ng-template>
</cairn-data-table>
```

Note: The default styles are enclosed within the `@layer cairn` CSS cascade layer, which means your custom styles will easily override the defaults without any specificity battles.

### Accessibility

1. Header sorting is triggered via real `<button>` elements that can be focused using the Tab key.
2. `Enter` and Space keys apply sorting, `Escape` clears sorting.
3. `<th>` elements have `scope` and `aria-sort` attributes.
4. Selection checkboxes have accessible labels.
5. In the loading state, the table body carries the `aria-busy` attribute.
6. You can provide an accessible caption to the table via the `caption` input.

### Roadmap, Contributing, and License

V1 exclusions (not supported in current version):
- No virtual scrolling
- No column resizing
- No column drag and drop
- No row grouping
- Server-side example is in a separate document.

V2 will include row spanning.

Please read our [CONTRIBUTING.md](../../CONTRIBUTING.md) if you want to contribute.

This project is licensed under the MIT License.
