<img src="https://raw.githubusercontent.com/gunerkaanalkim/cairn/main/assets/logo/cairn-wordmark-auto.svg" alt="Cairn" width="150" />

# Cairn DataTable

A signal-based, zoneless datatable for Angular 21+ with zero runtime dependencies.

[![npm version](https://img.shields.io/npm/v/@gunerkaanalkim/cairn-datatable)](https://www.npmjs.com/package/@gunerkaanalkim/cairn-datatable) [![License](https://img.shields.io/npm/l/@gunerkaanalkim/cairn-datatable)](https://www.npmjs.com/package/@gunerkaanalkim/cairn-datatable)

**Live demo and documentation:** [https://gunerkaanalkim.github.io/cairn/](https://gunerkaanalkim.github.io/cairn/)

## Features

1. Zero runtime dependencies. The package depends on nothing but Angular itself.
2. Works zoneless, does not require `zone.js`.
3. Signal-based derivation chain, only the changed stage is recalculated.
4. Two layers: the `core` entry point for pure logic, the main entry point for a ready-to-use component.
5. Unopinionated styling. You can apply your own classes to every element, or use plain CSS (Cascading Style Sheets) against the published `data-*` attributes.
6. Sorting, filtering, pagination and selection, preserving multi-page selection.
7. Template overrides for cells, headers, the empty state and the loading state.
8. Full keyboard navigation and screen reader support.

## Requirements

1. Angular `^21.0.0 || ^22.0.0`, for both `@angular/core` and `@angular/common`.
2. Zoneless change detection is not strictly required, but highly recommended.
3. A modern web browser.

## Installation

```bash
npm install @gunerkaanalkim/cairn-datatable
```

Import the optional default styles:

```css
@import '@gunerkaanalkim/cairn-datatable/styles/cairn-datatable.css';
```

If the styles are not imported, the table renders as a completely unstyled HTML table. That is a supported mode, not a broken one.

## Quick start

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
  selector: 'app-people',
  imports: [DataTable],
  template: '<cairn-data-table [table]="table" [selectable]="true" />',
})
export class People {
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

## Two-layer architecture

1. `@gunerkaanalkim/cairn-datatable/core` contains no component and no template. It exports the `createTable` factory, three default constants and every type. It depends on Angular signals alone and never touches the DOM (Document Object Model), so it also runs during SSR (Server-Side Rendering).
2. `@gunerkaanalkim/cairn-datatable` re-exports everything above and adds the `DataTable` component, the four template directives and the `CairnClassNames` interface.

Import only the core entry point when you render the rows yourself. See [Headless usage](https://github.com/gunerkaanalkim/cairn/blob/main/docs/headless.md).

## Documentation

Every page below has a matching live demo on the documentation site.

1. [Getting started](https://github.com/gunerkaanalkim/cairn/blob/main/docs/getting-started.md) - installation, the peer range and a first table.
2. [Core concepts](https://github.com/gunerkaanalkim/cairn/blob/main/docs/core-concepts.md) - the two entry points, the derivation chain and row identity.
3. [Columns](https://github.com/gunerkaanalkim/cairn/blob/main/docs/columns.md) - accessors, formatters, alignment and per-column switches.
4. [Sorting](https://github.com/gunerkaanalkim/cairn/blob/main/docs/sorting.md) - the click cycle, multi-column sorting and custom comparators.
5. [Filtering](https://github.com/gunerkaanalkim/cairn/blob/main/docs/filtering.md) - the global filter, per-column filters and custom predicates.
6. [Pagination](https://github.com/gunerkaanalkim/cairn/blob/main/docs/pagination.md) - page state, clamping rules and a complete pager.
7. [Selection](https://github.com/gunerkaanalkim/cairn/blob/main/docs/selection.md) - selection across pages and the page-scoped helpers.
8. [Column visibility](https://github.com/gunerkaanalkim/cairn/blob/main/docs/column-visibility.md) - building a column picker.
9. [Templates](https://github.com/gunerkaanalkim/cairn/blob/main/docs/templates.md) - `cairnCell`, `cairnHeader`, `cairnEmpty` and `cairnLoading`.
10. [Styling](https://github.com/gunerkaanalkim/cairn/blob/main/docs/styling.md) - the shipped stylesheet, the `classNames` input and the data attributes.
11. [Headless usage](https://github.com/gunerkaanalkim/cairn/blob/main/docs/headless.md) - rendering without the component.
12. [State and persistence](https://github.com/gunerkaanalkim/cairn/blob/main/docs/state.md) - saving and restoring a view.
13. [Server-side data](https://github.com/gunerkaanalkim/cairn/blob/main/docs/server-side.md) - the `manual` flags.
14. [Accessibility](https://github.com/gunerkaanalkim/cairn/blob/main/docs/accessibility.md) - the keyboard map and the emitted ARIA (Accessible Rich Internet Applications) attributes.
15. [API reference](https://github.com/gunerkaanalkim/cairn/blob/main/docs/api-reference.md) - every export with its exact signature.

## Not in this version

1. No virtual scrolling.
2. No column resizing.
3. No column drag and drop.
4. No row grouping and no row spanning. Row spanning is planned for version 2.

## Contributing and license

Please read our [CONTRIBUTING.md](https://github.com/gunerkaanalkim/cairn/blob/main/CONTRIBUTING.md) if you want to contribute.

This project is licensed under the MIT License.
