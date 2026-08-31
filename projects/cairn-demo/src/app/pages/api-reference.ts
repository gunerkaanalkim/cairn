import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiList, type ApiEntry } from '../ui/api-list';
import { CodeBlock } from '../ui/code-block';
import { DocsPage } from '../ui/docs-page';
import { Prose } from '../ui/prose';

@Component({
  selector: 'app-api-reference',
  imports: [RouterLink, ApiList, CodeBlock, DocsPage, Prose],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page
      eyebrow="Reference"
      heading="API reference"
      lead="Every export, with its exact signature and the behaviour behind it."
    >
      <docs-prose>
        <h2>Entry points</h2>
        <ol>
          <li>
            <code>@gunerkaanalkim/cairn-datatable/core</code> exports <code>createTable</code>, the
            three default constants and every type. No component, no DOM.
          </li>
          <li>
            <code>@gunerkaanalkim/cairn-datatable</code> re-exports all of the above and adds
            <code>DataTable</code>, <code>CairnCell</code>, <code>CairnHeader</code>,
            <code>CairnEmpty</code>, <code>CairnLoading</code>, <code>CellContext</code> and
            <code>CairnClassNames</code>.
          </li>
          <li>
            <code>@gunerkaanalkim/cairn-datatable/styles/cairn-datatable.css</code> is the optional
            stylesheet.
          </li>
        </ol>

        <h2>createTable</h2>
      </docs-prose>

      <docs-code [code]="signature" lang="ts" title="Signature" />
      <docs-api heading="TableOptions" [entries]="options" />

      <docs-prose>
        <h2>ColumnDef</h2>
      </docs-prose>
      <docs-api [entries]="columnDef" />

      <docs-prose>
        <h2>TableApi, derived data</h2>
      </docs-prose>
      <docs-api [entries]="apiRead" />

      <docs-prose>
        <h2>TableApi, state signals</h2>
      </docs-prose>
      <docs-api [entries]="apiState" />

      <docs-prose>
        <h2>TableApi, methods</h2>
      </docs-prose>
      <docs-api [entries]="apiWrite" />

      <docs-prose>
        <h2>Supporting types</h2>
      </docs-prose>
      <docs-code [code]="types" lang="ts" title="Types" />

      <docs-prose>
        <h2>Constants</h2>
      </docs-prose>
      <docs-api [entries]="constants" />

      <docs-prose>
        <h2>DataTable component</h2>
        <p>
          Selector <code>cairn-data-table</code>. Standalone, <code>OnPush</code>, and it renders a
          block level host element.
        </p>
      </docs-prose>
      <docs-api heading="Inputs" [entries]="inputs" />

      <docs-prose>
        <h2>Template directives</h2>
      </docs-prose>
      <docs-api [entries]="directives" />

      <docs-prose>
        <h2>Rendered markup</h2>
        <p>
          Each element carries a stable class, an optional class from
          <a routerLink="/styling">classNames</a>, and the data attributes listed below.
        </p>
      </docs-prose>
      <docs-code [code]="markup" lang="html" title="Structure" />
      <docs-api heading="Data attributes" [entries]="attributes" />

      <docs-prose>
        <h2>Not in this version</h2>
        <ol>
          <li>No virtual scrolling.</li>
          <li>No column resizing.</li>
          <li>No column drag and drop.</li>
          <li>No row grouping and no row spanning. Row spanning is planned for version 2.</li>
        </ol>
      </docs-prose>
    </docs-page>
  `,
})
export class ApiReferencePage {
  protected readonly signature = `
function createTable<T>(options: TableOptions<T>): TableApi<T>;
`;

  protected readonly types = `
type RowId = string | number;
type SortDirection = 'asc' | 'desc';
type ColumnAlign = 'start' | 'center' | 'end';
type Accessor<TValue> = () => TValue;

interface Row<T> {
  readonly id: RowId;          // from TableOptions.rowId
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
`;

  protected readonly markup = `
<cairn-data-table class="cairn-root">
  <table class="cairn-table">
    <caption>…</caption>
    <thead class="cairn-thead">
      <tr class="cairn-header-row">
        <th class="cairn-selection-header-cell" scope="col">…</th>
        <th class="cairn-header-cell" scope="col" aria-sort data-column-id data-sorted data-align>
          <button class="cairn-header-button">
            …
            <span class="cairn-sort-icon">↑</span>
          </button>
        </th>
      </tr>
    </thead>
    <tbody class="cairn-tbody" aria-busy>
      <tr class="cairn-row cairn-row-even" data-selected>
        <td class="cairn-selection-cell">…</td>
        <td class="cairn-cell" data-column-id data-align>…</td>
      </tr>
      <tr class="cairn-empty-row"><td class="cairn-empty-cell" colspan>…</td></tr>
      <tr class="cairn-loading-row"><td class="cairn-loading-cell" colspan>…</td></tr>
    </tbody>
  </table>
</cairn-data-table>
`;

  protected readonly options: readonly ApiEntry[] = [
    { name: 'data', type: '() => readonly T[]', description: 'Required. Reactive source of rows.' },
    { name: 'columns', type: '() => readonly ColumnDef<T>[]', description: 'Required. Reactive source of column definitions.' },
    { name: 'rowId', type: '(row: T, index: number) => RowId', defaultValue: '(row, index) => index', description: 'Stable row identity. Selection is keyed by it, so an index based default breaks when the array is replaced.' },
    { name: 'initialState', type: 'Partial<TableState>', defaultValue: '{}', description: 'Seeds any of the six state slices before the first render.' },
    { name: 'multiSort', type: 'boolean', defaultValue: 'true', description: 'Allows several active sort columns. When false, an additive toggle replaces the sort instead of appending.' },
    { name: 'sortFn', type: '(a: unknown, b: unknown) => number', defaultValue: 'numeric for numbers, localeCompare otherwise', description: 'Table wide fallback comparator, used by every column without its own sortFn.' },
    { name: 'filterFn', type: '(value: unknown, query: string) => boolean', defaultValue: 'case insensitive substring match', description: 'Table wide fallback predicate, used by every column without its own filterFn.' },
    { name: 'manual', type: '{ sorting?: boolean; filtering?: boolean; pagination?: boolean }', defaultValue: '{}', description: 'Disables individual pipeline stages while still tracking their state.' },
  ];

  protected readonly columnDef: readonly ApiEntry[] = [
    { name: 'id', type: 'string', description: 'Required. Unique identifier, default accessor key, and the value published as data-column-id.' },
    { name: 'header', type: 'string', description: 'Required. Header text when no cairnHeader template applies.' },
    { name: 'accessor', type: '(row: T) => unknown', defaultValue: '(row) => row[id]', description: 'Extracts the raw value used by sorting, filtering, cellValue and cellText.' },
    { name: 'formatter', type: '(value: unknown, row: T) => string', defaultValue: 'String(value), empty string for nullish', description: 'Display text only. Never affects sorting or filtering.' },
    { name: 'sortable', type: 'boolean', defaultValue: 'true', description: 'When false the header renders without a button and toggleSort ignores the column.' },
    { name: 'filterable', type: 'boolean', defaultValue: 'true', description: 'When false the stored column filter is never applied.' },
    { name: 'globallyFilterable', type: 'boolean', defaultValue: 'true', description: 'When false the column is skipped during the global filter scan.' },
    { name: 'hidden', type: 'boolean', defaultValue: 'false', description: 'Hidden on first render. Ignored entirely when initialState.hiddenColumns is supplied.' },
    { name: 'align', type: 'ColumnAlign', defaultValue: "'start'", description: 'Published as data-align. The shipped stylesheet maps it to text alignment.' },
    { name: 'sortFn', type: '(a: unknown, b: unknown, rowA: T, rowB: T) => number', description: 'Column comparator. Receives raw values in ascending order, the direction is applied afterwards.' },
    { name: 'filterFn', type: '(value: unknown, query: string, row: T) => boolean', description: 'Column predicate. Used by both the column filter and the global filter.' },
    { name: 'meta', type: 'Readonly<Record<string, unknown>>', description: 'Arbitrary consumer data. Never read by the library.' },
  ];

  protected readonly apiRead: readonly ApiEntry[] = [
    { name: 'rows', type: 'Signal<readonly Row<T>[]>', description: 'Filtered, sorted and paginated rows with the selection flag merged in. This is what you render.' },
    { name: 'sortedRows', type: 'Signal<readonly Row<T>[]>', description: 'Filtered and sorted rows before the page slice.' },
    { name: 'visibleColumns', type: 'Signal<readonly ColumnDef<T>[]>', description: 'Columns that are not hidden, in declaration order. Also the set that filtering scans.' },
    { name: 'allColumns', type: 'Signal<readonly ColumnDef<T>[]>', description: 'Every column with the hidden flag resolved from the current state.' },
    { name: 'totalRowCount', type: 'Signal<number>', description: 'Number of source rows.' },
    { name: 'filteredRowCount', type: 'Signal<number>', description: 'Number of rows surviving the filters.' },
    { name: 'pageCount', type: 'Signal<number>', description: 'Math.max(1, ceil(filteredRowCount / pageSize)).' },
    { name: 'isEmpty', type: 'Signal<boolean>', description: 'True when the current page has no rows.' },
    { name: 'selectedRows', type: 'Signal<readonly T[]>', description: 'Source objects for every selected identity, across pages and regardless of filters.' },
    { name: 'allPageRowsSelected', type: 'Signal<boolean>', description: 'True when the page is non empty and every row on it is selected.' },
    { name: 'somePageRowsSelected', type: 'Signal<boolean>', description: 'True when the page is partially selected. Drives the indeterminate header checkbox.' },
  ];

  protected readonly apiState: readonly ApiEntry[] = [
    { name: 'sorting', type: 'Signal<readonly SortState[]>', description: 'Ordered sort entries, primary sort first.' },
    { name: 'globalFilter', type: 'Signal<string>', description: 'The global query.' },
    { name: 'columnFilters', type: 'Signal<Readonly<Record<string, string>>>', description: 'Query per column id. Empty values are kept but skipped.' },
    { name: 'pagination', type: 'Signal<PaginationState>', description: 'Stored page index and page size. The rendered page may be clamped without changing this value.' },
    { name: 'selection', type: 'Signal<ReadonlySet<RowId>>', description: 'Selected row identities.' },
    { name: 'state', type: 'Signal<TableState>', description: 'All six slices as one snapshot.' },
  ];

  protected readonly apiWrite: readonly ApiEntry[] = [
    { name: 'toggleSort', type: '(columnId: string, additive?: boolean) => void', description: 'Cycles ascending, descending, unsorted. Additive appends only when multiSort is enabled.' },
    { name: 'setSorting', type: '(sorting: readonly SortState[]) => void', description: 'Replaces the sort state, dropping entries for columns with sortable false.' },
    { name: 'clearSorting', type: '() => void', description: 'Removes every sort.' },
    { name: 'setGlobalFilter', type: '(query: string) => void', description: 'Sets the global query and resets the page index to zero.' },
    { name: 'setColumnFilter', type: '(columnId: string, query: string) => void', description: 'Sets one column query and resets the page index to zero.' },
    { name: 'clearFilters', type: '() => void', description: 'Clears every filter and resets the page index.' },
    { name: 'setPageIndex', type: '(pageIndex: number) => void', description: 'Jumps to a page, clamped into range.' },
    { name: 'setPageSize', type: '(pageSize: number) => void', description: 'Changes the page size and resets the page index to zero.' },
    { name: 'nextPage', type: '() => void', description: 'Forward one page, clamped at the last page.' },
    { name: 'previousPage', type: '() => void', description: 'Back one page, stopping at zero.' },
    { name: 'firstPage', type: '() => void', description: 'Jumps to page index zero.' },
    { name: 'lastPage', type: '() => void', description: 'Jumps to the last page.' },
    { name: 'toggleRowSelection', type: '(rowId: RowId) => void', description: 'Flips one row.' },
    { name: 'setRowSelected', type: '(rowId: RowId, selected: boolean) => void', description: 'Sets one row explicitly.' },
    { name: 'isRowSelected', type: '(rowId: RowId) => boolean', description: 'Reads one row.' },
    { name: 'toggleAllPageRows', type: '() => void', description: 'Selects the whole page, or clears it when already fully selected.' },
    { name: 'clearSelection', type: '() => void', description: 'Empties the selection.' },
    { name: 'setColumnVisibility', type: '(columnId: string, visible: boolean) => void', description: 'Shows or hides one column.' },
    { name: 'toggleColumnVisibility', type: '(columnId: string) => void', description: 'Flips one column.' },
    { name: 'isColumnVisible', type: '(columnId: string) => boolean', description: 'Reads one column. False for an unknown id.' },
    { name: 'cellValue', type: '(row: Row<T>, columnId: string) => unknown', description: 'Raw accessor value. Undefined for an unknown column id.' },
    { name: 'cellText', type: '(row: Row<T>, columnId: string) => string', description: 'Formatted display text. Empty string for an unknown column id or a nullish value.' },
    { name: 'setState', type: '(state: Partial<TableState>) => void', description: 'Writes only the keys provided. Applies no clamping.' },
  ];

  protected readonly constants: readonly ApiEntry[] = [
    { name: 'DEFAULT_PAGE_SIZE', type: 'number', defaultValue: '10', description: 'Page size used when initialState.pagination is not supplied.' },
    { name: 'DEFAULT_EMPTY_MESSAGE', type: 'string', defaultValue: "'No records found'", description: 'Default value of the emptyMessage input.' },
    { name: 'DEFAULT_SORT_CYCLE', type: "readonly ['asc', 'desc', null]", description: 'The order toggleSort walks through.' },
  ];

  protected readonly inputs: readonly ApiEntry[] = [
    { name: 'table', type: 'TableApi<T>', description: 'Required. The object returned by createTable.' },
    { name: 'classNames', type: 'CairnClassNames', defaultValue: '{}', description: 'Class names appended per element. Nineteen keys, all optional.' },
    { name: 'caption', type: 'string', defaultValue: "''", description: 'Renders a caption element. Empty means no caption.' },
    { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'Replaces the body with the loading state and sets aria-busy on the tbody.' },
    { name: 'emptyMessage', type: 'string', defaultValue: 'DEFAULT_EMPTY_MESSAGE', description: 'Text shown when the page is empty and no cairnEmpty template is provided.' },
    { name: 'selectable', type: 'boolean', defaultValue: 'false', description: 'Adds the checkbox column and the select all header checkbox.' },
  ];

  protected readonly directives: readonly ApiEntry[] = [
    { name: 'cairnCell', type: 'ng-template, optional column id', description: 'Overrides body cell content. Context: $implicit raw value, row, columnId. A column specific template wins over a generic one.' },
    { name: 'cairnHeader', type: 'ng-template, optional column id', description: 'Overrides header content. Context: $implicit is the ColumnDef. Rendered inside the sort button when sortable.' },
    { name: 'cairnEmpty', type: 'ng-template', description: 'Overrides the empty state cell. No context.' },
    { name: 'cairnLoading', type: 'ng-template', description: 'Overrides the loading state cell. No context.' },
  ];

  protected readonly attributes: readonly ApiEntry[] = [
    { name: 'data-column-id', type: 'string', description: 'On every header cell and body cell. The column id.' },
    { name: 'data-sorted', type: "'none' | 'ascending' | 'descending'", description: 'On the header cell, mirroring aria-sort.' },
    { name: 'data-selected', type: "'true' | 'false'", description: 'On the body row.' },
    { name: 'data-align', type: "'start' | 'center' | 'end'", description: 'On the header cell and body cell, from ColumnDef.align.' },
  ];
}
