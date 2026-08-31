# Getting started

Live demo: [https://gunerkaanalkim.github.io/cairn/installation](https://gunerkaanalkim.github.io/cairn/installation)

## 1. Install the package

```bash
npm install @gunerkaanalkim/cairn-datatable
```

## 2. Check the peer range

1. Angular `^21.0.0 || ^22.0.0` is required, for both `@angular/core` and `@angular/common`.
2. Zoneless change detection is not mandatory, but the library is written for it and behaves best without `zone.js`.
3. No other runtime dependency is installed. The package declares no dependencies at all.

## 3. Import the optional stylesheet

```css
@import '@gunerkaanalkim/cairn-datatable/styles/cairn-datatable.css';
```

Without this import the table renders as a completely unstyled HTML table. That is a supported mode, not a broken one. See [Styling](styling.md) for the three ways to dress it up.

The default rules live inside the `@layer cairn` CSS (Cascading Style Sheets) cascade layer, so any rule you write outside a layer wins without needing a higher specificity.

## 4. Render a table

`createTable` comes from the `/core` entry point and the component from the root entry point. Importing only `/core` keeps the component and its template out of your bundle.

```typescript
import { Component, signal } from '@angular/core';
import { DataTable } from '@gunerkaanalkim/cairn-datatable';
import { createTable, type ColumnDef } from '@gunerkaanalkim/cairn-datatable/core';

interface Person {
  id: number;
  name: string;
  role: string;
}

@Component({
  selector: 'app-root',
  imports: [DataTable],
  template: '<cairn-data-table [table]="table" />',
})
export class App {
  readonly data = signal<Person[]>([
    { id: 1, name: 'Ada Adler', role: 'Owner' },
    { id: 2, name: 'Bruno Costa', role: 'Editor' },
  ]);

  readonly columns = signal<ColumnDef<Person>[]>([
    { id: 'name', header: 'Name' },
    { id: 'role', header: 'Role' },
  ]);

  readonly table = createTable({
    data: this.data,
    columns: this.columns,
    rowId: (row) => row.id,
  });
}
```

## 5. Add the pieces you need

1. Turn on the checkbox column with `[selectable]="true"`.
2. Give the table an accessible name with `caption="Team members"`.
3. Show a spinner state with `[loading]="isLoading()"`.
4. Wire a search box to `table.setGlobalFilter(value)`.
5. Render your own pager from `table.pagination()` and `table.pageCount()`. See [Pagination](pagination.md).

## 6. Server-side rendering

The core layer touches no browser API, so it runs unchanged on the server. The component layer renders plain table markup and only reads the DOM (Document Object Model) through Angular bindings. Nothing extra is needed for SSR (Server-Side Rendering).

## Next

1. [Core concepts](core-concepts.md) explains why the library is split in two and how the derivation chain works.
2. [Columns](columns.md) is the fastest way to understand what a column definition can do.
