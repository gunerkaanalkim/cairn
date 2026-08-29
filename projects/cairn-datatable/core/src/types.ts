import type { Signal } from '@angular/core';

/** Stable identity of a row. Must be unique within the data set. */
export type RowId = string | number;

/** Sort direction. Absence of a SortState means unsorted. */
export type SortDirection = 'asc' | 'desc';

/** Horizontal alignment of a column's content. */
export type ColumnAlign = 'start' | 'center' | 'end';

/** Read-only accessor used to feed reactive values into the table core. */
export type Accessor<TValue> = () => TValue;

export interface ColumnDef<T> {
  /** Unique identifier. Also used as the default accessor key. */
  readonly id: string;

  /** Text rendered in the header cell. */
  readonly header: string;

  /** Extracts the raw value from a row. Defaults to (row as never)[id]. */
  readonly accessor?: (row: T) => unknown;

  /** Converts the raw value into display text. Defaults to String(value). */
  readonly formatter?: (value: unknown, row: T) => string;

  /** Enables sorting on this column. Default: true. */
  readonly sortable?: boolean;

  /** Enables the per-column filter on this column. Default: true. */
  readonly filterable?: boolean;

  /** Includes this column in the global filter scan. Default: true. */
  readonly globallyFilterable?: boolean;

  /** Hides the column on first render. Default: false. */
  readonly hidden?: boolean;

  /** Horizontal alignment hint consumed by the component layer. */
  readonly align?: ColumnAlign;

  /** Custom comparator. Receives raw values, not formatted text. */
  readonly sortFn?: (a: unknown, b: unknown, rowA: T, rowB: T) => number;

  /** Custom predicate. Return true to keep the row. */
  readonly filterFn?: (value: unknown, query: string, row: T) => boolean;

  /** Arbitrary consumer data. The library never reads this. */
  readonly meta?: Readonly<Record<string, unknown>>;
}

export interface Row<T> {
  /** Stable identity produced by TableOptions.rowId. */
  readonly id: RowId;

  /** Index within the original data array, not within the current page. */
  readonly sourceIndex: number;

  /** The original row object. Never cloned, never mutated. */
  readonly data: T;

  /** Whether this row is part of the current selection. */
  readonly selected: boolean;
}

export interface SortState {
  readonly id: string;
  readonly direction: SortDirection;
}

export interface PaginationState {
  /** Zero-based page index. */
  readonly pageIndex: number;

  /** Rows per page. Must be greater than zero. */
  readonly pageSize: number;
}

export interface TableState {
  readonly sorting: readonly SortState[];
  readonly globalFilter: string;
  readonly columnFilters: Readonly<Record<string, string>>;
  readonly pagination: PaginationState;
  readonly selection: ReadonlySet<RowId>;
  readonly hiddenColumns: ReadonlySet<string>;
}

export interface TableOptions<T> {
  /** Reactive source of row data. */
  readonly data: Accessor<readonly T[]>;

  /** Reactive source of column definitions. */
  readonly columns: Accessor<readonly ColumnDef<T>[]>;

  /** Produces a stable identity for a row. Defaults to the array index. */
  readonly rowId?: (row: T, index: number) => RowId;

  /** Partial initial state. Missing keys fall back to library defaults. */
  readonly initialState?: Partial<TableState>;

  /** Allows more than one active sort column. Default: true. */
  readonly multiSort?: boolean;

  /** Fallback comparator used when a column has no sortFn. */
  readonly sortFn?: (a: unknown, b: unknown) => number;

  /** Fallback predicate used when a column has no filterFn. */
  readonly filterFn?: (value: unknown, query: string) => boolean;

  /** Disables built-in pipeline stages so a server can own them. */
  readonly manual?: {
    readonly sorting?: boolean;
    readonly filtering?: boolean;
    readonly pagination?: boolean;
  };
}

export interface TableApi<T> {
  /** Rows after filtering, sorting and pagination. This is what you render. */
  readonly rows: Signal<readonly Row<T>[]>;

  /** Rows after filtering and sorting, before pagination. */
  readonly sortedRows: Signal<readonly Row<T>[]>;

  /** Columns excluding hidden ones, in declaration order. */
  readonly visibleColumns: Signal<readonly ColumnDef<T>[]>;

  /** Every column, including hidden ones. */
  readonly allColumns: Signal<readonly ColumnDef<T>[]>;

  readonly sorting: Signal<readonly SortState[]>;
  readonly globalFilter: Signal<string>;
  readonly columnFilters: Signal<Readonly<Record<string, string>>>;
  readonly pagination: Signal<PaginationState>;
  readonly selection: Signal<ReadonlySet<RowId>>;

  /** Total number of source rows. */
  readonly totalRowCount: Signal<number>;

  /** Number of rows surviving the filters. */
  readonly filteredRowCount: Signal<number>;

  /** Number of pages, never less than one. */
  readonly pageCount: Signal<number>;

  /** True when the rendered row set is empty. */
  readonly isEmpty: Signal<boolean>;

  /** Selection helpers scoped to the current page. */
  readonly allPageRowsSelected: Signal<boolean>;
  readonly somePageRowsSelected: Signal<boolean>;

  /** Source objects of the current selection, across all pages. */
  readonly selectedRows: Signal<readonly T[]>;

  /** Cycles a column through ascending, descending and unsorted. */
  toggleSort(columnId: string, additive?: boolean): void;
  setSorting(sorting: readonly SortState[]): void;
  clearSorting(): void;

  setGlobalFilter(query: string): void;
  setColumnFilter(columnId: string, query: string): void;
  clearFilters(): void;

  setPageIndex(pageIndex: number): void;
  setPageSize(pageSize: number): void;
  nextPage(): void;
  previousPage(): void;
  firstPage(): void;
  lastPage(): void;

  toggleRowSelection(rowId: RowId): void;
  setRowSelected(rowId: RowId, selected: boolean): void;
  isRowSelected(rowId: RowId): boolean;
  toggleAllPageRows(): void;
  clearSelection(): void;

  setColumnVisibility(columnId: string, visible: boolean): void;
  toggleColumnVisibility(columnId: string): void;
  isColumnVisible(columnId: string): boolean;

  /** Reads the raw, unformatted value of a cell. */
  cellValue(row: Row<T>, columnId: string): unknown;

  /** Reads the display text of a cell, applying the column formatter. */
  cellText(row: Row<T>, columnId: string): string;

  /** Replaces the entire state. Useful for restoring a saved view. */
  setState(state: Partial<TableState>): void;

  /** Current state snapshot. Useful for persisting a view. */
  readonly state: Signal<TableState>;
}