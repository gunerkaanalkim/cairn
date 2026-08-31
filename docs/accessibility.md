# Accessibility

Live demo: [https://gunerkaanalkim.github.io/cairn/accessibility](https://gunerkaanalkim.github.io/cairn/accessibility)

Real buttons, real table semantics, and the ARIA (Accessible Rich Internet Applications) attributes a screen reader expects from a sortable grid.

## Keyboard map

1. `Tab` - moves focus to the next sortable header button, then out of the table.
2. `Enter` - cycles the focused column: ascending, descending, unsorted.
3. `Space` - same as Enter. Scrolling is suppressed while a header has focus.
4. `Shift` with `Enter` - adds the focused column to the existing sort instead of replacing it.
5. `Escape` - clears every sort, not only the focused column.

## What the component emits

1. Native `table`, `thead`, `tbody`, `tr`, `th` and `td` elements, so assistive technology gets row and column context for free.
2. `scope="col"` on every header cell.
3. `aria-sort` on every header cell, with `none`, `ascending` or `descending`. A column with `sortable: false` always reports `none`.
4. A real `<button>` inside each sortable header, which is what makes the column reachable by Tab and operable by Enter and Space without any custom key handling.
5. `aria-busy="true"` on the `tbody` while the `loading` input is true.
6. Labelled checkboxes: `Select all rows on this page` for the header, and `Select row` followed by the row identity for each row.

## Give the table a caption

The `caption` input renders a real `<caption>` element. It is the accessible name of the table and the first thing a screen reader announces, so prefer it over a visually adjacent heading.

```html
<cairn-data-table
  [table]="table"
  [selectable]="true"
  caption="Team members, sortable by column"
  [loading]="loading()"
  emptyMessage="No members match this search."
/>
```

## Two things you have to do yourself

1. Row checkbox labels use the row identity. With the default `rowId` that is an array index, which reads as "Select row 4". Pass a `rowId` that means something, or replace the label by rendering your own checkbox column with a `cairnCell` template. See [Templates](templates.md).
2. Pagination controls are yours. The library renders none, so the buttons in your pager need their own accessible names and disabled states. The pager in [Pagination](pagination.md) is a working starting point.

## Contrast and focus

The shipped stylesheet sets colours through five custom properties and does not define a focus ring, deferring to the browser default. If you restyle the header button, keep a visible `:focus-visible` outline that meets the WCAG (Web Content Accessibility Guidelines) AA contrast minimum.
