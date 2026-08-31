# Templates

Live demo: [https://gunerkaanalkim.github.io/cairn/templates](https://gunerkaanalkim.github.io/cairn/templates)

Four structural directives let you replace any cell, any header, the empty state and the loading state without giving up the rest of the component.

Each directive is a plain `ng-template` projected into `cairn-data-table`. `cairnCell` and `cairnHeader` take an optional column id: with an id they override that one column, without an id they override every column. A column-specific template always wins over the generic one.

## Directives

1. `cairnCell` - `ng-template`, optional column id. Replaces the body cell content. Context: `$implicit` is the raw value, `row` is the source object, `columnId` is the column id.
2. `cairnHeader` - `ng-template`, optional column id. Replaces the header content. Context: `$implicit` is the `ColumnDef`. Rendered inside the sort button when the column is sortable.
3. `cairnEmpty` - `ng-template`. Replaces the empty state row. No context.
4. `cairnLoading` - `ng-template`. Replaces the body while the `loading` input is true. No context.
5. `loading` - `boolean` component input, default `false`. Swaps the body for the loading state and sets `aria-busy` on the `tbody`.
6. `emptyMessage` - `string` component input, default `'No records found'`. Fallback text when no `cairnEmpty` template is provided.

## Example

```typescript
const columns: ColumnDef<Employee>[] = [
  { id: 'name', header: 'Name' },
  { id: 'status', header: 'Status' },
  { id: 'projects', header: 'Projects', align: 'end' },
  // An action column is a normal column with nothing to read and nothing to sort.
  { id: 'actions', header: '', sortable: false, filterable: false, globallyFilterable: false },
];
```

```html
<cairn-data-table [table]="table" [loading]="loading()">
  <!-- One column, by id. The context carries the raw value and the row. -->
  <ng-template cairnCell="status" let-value let-row="row">
    <span class="badge" [class.badge-active]="value === 'active'">{{ value }}</span>
  </ng-template>

  <!-- A column with no underlying field, driven purely by the template. -->
  <ng-template cairnCell="actions" let-row="row">
    <button type="button" (click)="invite(row)">Invite</button>
  </ng-template>

  <!-- Header override for a single column. -->
  <ng-template cairnHeader="projects" let-column>
    <span title="Projects the member is assigned to">{{ column.header }} #</span>
  </ng-template>

  <!-- Shown when the current page is empty. -->
  <ng-template cairnEmpty>
    <div class="empty">No members match this search.</div>
  </ng-template>

  <!-- Shown instead of the body while [loading] is true. -->
  <ng-template cairnLoading>
    <div class="loading">Fetching members...</div>
  </ng-template>
</cairn-data-table>
```

## Template context

1. `cairnCell` exposes the raw accessor value as `$implicit`, the original row object as `row`, and the column id as `columnId`. Note that it is the raw value, so a formatter does not apply inside your template.
2. `cairnHeader` exposes the `ColumnDef` as `$implicit`, which is how you reach `meta` from the header.
3. `cairnEmpty` and `cairnLoading` take no context.

```html
<ng-template cairnCell="email" let-value let-row="row" let-columnId="columnId">
  <a [href]="'mailto:' + value" [attr.data-column]="columnId">{{ row.name }}</a>
</ng-template>

<ng-template cairnHeader let-column>
  <span [class.required]="column.meta?.['required'] === true">{{ column.header }}</span>
</ng-template>
```

## Where the state templates render

1. The loading template replaces the whole body while the `loading` input is true, in a single cell spanning every column, and the body carries `aria-busy="true"`.
2. The empty template renders when `isEmpty()` is true, again in a spanning cell.
3. Without a template, the component falls back to `Loading...` and to the `emptyMessage` input, whose default is `DEFAULT_EMPTY_MESSAGE`.

## Keeping the header sortable

A `cairnHeader` template is rendered inside the sort button, so the column stays sortable and keyboard reachable. Put no button of your own in there. If a column should not sort, set `sortable: false` on its definition and the header renders as plain content instead.
