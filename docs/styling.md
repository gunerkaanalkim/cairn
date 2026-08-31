# Styling

Live demo: [https://gunerkaanalkim.github.io/cairn/styling](https://gunerkaanalkim.github.io/cairn/styling)

Three independent ways to dress the same markup: the shipped stylesheet, a class name per element, or plain CSS (Cascading Style Sheets) against the published data attributes.

## 1. The shipped stylesheet

A single optional import.

```css
@import '@gunerkaanalkim/cairn-datatable/styles/cairn-datatable.css';
```

Every rule lives inside the `@layer cairn` cascade layer, so any unlayered rule of yours wins regardless of specificity. It also defines five custom properties you can re-map without touching a selector.

```css
/* The five custom properties declared on .cairn-table */
.cairn-table {
  --cairn-border: #e4e4e7;
  --cairn-header-bg: #fafafa;
  --cairn-row-hover: #f4f4f5;
  --cairn-text: #18181b;
  --cairn-bg: #ffffff;
}

/* Class driven dark mode instead of prefers-color-scheme */
html.dark .cairn-table {
  --cairn-border: #27272a;
  --cairn-header-bg: #18181b;
  --cairn-row-hover: #27272a;
  --cairn-text: #fafafa;
  --cairn-bg: #09090b;
}
```

The stylesheet switches to a dark palette through `prefers-color-scheme`. If your application drives dark mode from a class on the root element instead, re-declare the five properties under that class.

Skipping the import is a supported mode. You get a bare, entirely unstyled `<table>`, which is the right starting point when your design system already styles table elements.

## 2. The classNames input

Nineteen keys, one per element the component renders. Values are appended to the built-in class, never replace it, so the `data-*` hooks and the default rules keep working alongside your utilities.

1. `root` - the host `cairn-data-table` element. The right place for a scope class.
2. `table` - the `table` element.
3. `thead` - the `thead` element.
4. `headerRow` - the `tr` inside `thead`.
5. `headerCell` - every `th` rendered for a column.
6. `headerCellSorted` - added to the `th` while that column is sorted.
7. `sortIcon` - the `span` holding the ascending or descending arrow.
8. `tbody` - the `tbody` element.
9. `row` - every `tr` in the body.
10. `rowSelected` - added to a `tr` while the row is selected.
11. `rowEven` - rows at an even index on the current page.
12. `rowOdd` - rows at an odd index on the current page.
13. `cell` - every `td` rendered for a column.
14. `selectionHeaderCell` - the `th` holding the select all checkbox.
15. `selectionCell` - the `td` holding a row checkbox.
16. `emptyRow` - the `tr` rendered when the page is empty.
17. `emptyCell` - the spanning `td` rendered when the page is empty.
18. `loadingRow` - the `tr` rendered while loading.
19. `loadingCell` - the spanning `td` rendered while loading.

```html
<cairn-data-table
  [table]="table"
  [selectable]="true"
  [classNames]="{
    table: 'min-w-full divide-y divide-gray-200',
    headerCell: 'px-6 py-3 bg-gray-50 text-xs font-medium uppercase text-gray-500',
    cell: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500'
  }"
/>
```

## 3. Plain CSS against the data attributes

Every relevant element publishes its state as an attribute, so a stylesheet can do the whole job without a single class being passed in.

1. `data-column-id` on every header cell and body cell.
2. `data-sorted` on the header cell, with the values `none`, `ascending` and `descending`, mirroring `aria-sort`.
3. `data-selected` on the row, `true` or `false`.
4. `data-align` on the header cell and body cell, from the column definition.

```css
/* Highlight the sorted column, header and body cells alike. */
.cairn-table [data-sorted='ascending'],
.cairn-table [data-sorted='descending'] {
  color: #4f46e5;
}

/* Selected rows. */
.cairn-table tr[data-selected='true'] {
  background: #eef2ff;
}

/* One specific column. */
.cairn-table [data-column-id='email'] {
  font-family: ui-monospace, monospace;
}

/* Alignment comes from the column definition. */
.cairn-table [data-align='end'] {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
```

Because `cairn-data-table` is a component with emulated encapsulation, these rules have to live in a global stylesheet rather than in the parent component's `styles`. Scope them with `classNames.root`, which lands on the host element, if you need more than one look in the same application.

## Built-in class names

Each element also carries a stable class you can target directly: `cairn-root`, `cairn-table`, `cairn-thead`, `cairn-header-row`, `cairn-header-cell`, `cairn-header-cell-sorted`, `cairn-header-button`, `cairn-sort-icon`, `cairn-tbody`, `cairn-row`, `cairn-row-selected`, `cairn-row-even`, `cairn-row-odd`, `cairn-cell`, `cairn-selection-header-cell`, `cairn-selection-cell`, `cairn-empty-row`, `cairn-empty-cell`, `cairn-loading-row` and `cairn-loading-cell`.

For content rather than appearance, see [Templates](templates.md).
