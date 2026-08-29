import { computed, signal } from '@angular/core';
import type { TableApi, TableOptions, TableState, SortState, PaginationState, RowId, Row, ColumnDef } from './types';
import { DEFAULT_PAGE_SIZE } from './defaults';
import { buildRows } from './internal/row-model';
import { applyFilters, defaultFilterPredicate } from './internal/filtering';
import { applySorting, defaultComparator } from './internal/sorting';
import { applyPagination, clampPageIndex } from './internal/pagination';
import { markSelected, toggleId, togglePageIds } from './internal/selection';

export function createTable<T>(options: TableOptions<T>): TableApi<T> {
  const initial = options.initialState || {};

  const sortingState = signal<readonly SortState[]>(initial.sorting || []);
  const globalFilterState = signal<string>(initial.globalFilter || '');
  const columnFiltersState = signal<Readonly<Record<string, string>>>(initial.columnFilters || {});
  const paginationState = signal<PaginationState>(initial.pagination || { pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });
  const selectionState = signal<ReadonlySet<RowId>>(initial.selection || new Set());
  const initialHidden = new Set(initial.hiddenColumns || []);
  if (!initial.hiddenColumns) {
    for (const c of options.columns()) {
      if (c.hidden === true) initialHidden.add(c.id);
    }
  }
  const hiddenColumnsState = signal<ReadonlySet<string>>(initialHidden);

  const defaultRowId = (row: T, index: number) => index;
  const rowIdFn = options.rowId || defaultRowId;

  const baseRows = computed(() => buildRows(options.data(), rowIdFn));
  
  const allColumns = computed(() => {
    const cols = options.columns();
    const hidden = hiddenColumnsState();
    return cols.map(c => ({
      ...c,
      hidden: hidden.has(c.id)
    }));
  });

  const visibleColumnList = computed(() => allColumns().filter(c => !c.hidden));

  const filteredRows = computed(() => {
    const rows = baseRows();
    if (options.manual?.filtering) return rows;
    return applyFilters(
      rows,
      visibleColumnList(),
      globalFilterState(),
      columnFiltersState(),
      options.filterFn || defaultFilterPredicate
    );
  });

  const sortedRows = computed(() => {
    const rows = filteredRows();
    if (options.manual?.sorting) return rows;
    return applySorting(
      rows,
      allColumns(),
      sortingState(),
      options.sortFn || defaultComparator
    );
  });

  const totalRowCount = computed(() => baseRows().length);
  const filteredRowCount = computed(() => filteredRows().length);

  const pageCount = computed(() => {
    const count = filteredRowCount();
    const size = paginationState().pageSize;
    return Math.max(1, Math.ceil(count / size));
  });

  const pagedRows = computed(() => {
    const rows = sortedRows();
    if (options.manual?.pagination) return rows;
    
    // Auto-clamp if page is out of bounds
    const pState = paginationState();
    const clamped = clampPageIndex(pState.pageIndex, pageCount());
    if (clamped !== pState.pageIndex) {
      // NOTE: We do not write to signal here since it's inside computed.
      // We just use the clamped value for calculation.
      return applyPagination(rows, { ...pState, pageIndex: clamped });
    }
    return applyPagination(rows, pState);
  });

  const rows = computed(() => markSelected(pagedRows(), selectionState()));

  const isEmpty = computed(() => rows().length === 0);

  const allPageRowsSelected = computed(() => {
    const r = rows();
    return r.length > 0 && r.every(row => row.selected);
  });

  const somePageRowsSelected = computed(() => {
    const r = rows();
    return r.some(row => row.selected) && !allPageRowsSelected();
  });

  const selectedRows = computed(() => {
    const sel = selectionState();
    return baseRows().filter(r => sel.has(r.id)).map(r => r.data);
  });

  const state = computed<TableState>(() => ({
    sorting: sortingState(),
    globalFilter: globalFilterState(),
    columnFilters: columnFiltersState(),
    pagination: paginationState(),
    selection: selectionState(),
    hiddenColumns: hiddenColumnsState(),
  }));

  const api: TableApi<T> = {
    rows,
    sortedRows,
    visibleColumns: visibleColumnList,
    allColumns,
    sorting: sortingState,
    globalFilter: globalFilterState,
    columnFilters: columnFiltersState,
    pagination: paginationState,
    selection: selectionState,
    totalRowCount,
    filteredRowCount,
    pageCount,
    isEmpty,
    allPageRowsSelected,
    somePageRowsSelected,
    selectedRows,
    
    toggleSort: (columnId, additive) => {
      const col = allColumns().find(c => c.id === columnId);
      if (!col || col.sortable === false) return;
      const current = sortingState();
      const multi = options.multiSort ?? true;
      const index = current.findIndex(s => s.id === columnId);
      
      let next: SortState[] = [];
      if (additive && multi) {
        next = [...current];
      }
      
      if (index >= 0) {
        const s = current[index];
        if (s.direction === 'asc') {
          if (additive && multi) next[index] = { id: columnId, direction: 'desc' };
          else next = [{ id: columnId, direction: 'desc' }];
        } else {
          if (additive && multi) next.splice(index, 1);
          else next = [];
        }
      } else {
        if (additive && multi) next.push({ id: columnId, direction: 'asc' });
        else next = [{ id: columnId, direction: 'asc' }];
      }
      sortingState.set(next);
    },
    setSorting: (s) => {
      const cols = allColumns();
      sortingState.set(s.filter(entry => cols.find(c => c.id === entry.id)?.sortable !== false));
    },
    clearSorting: () => sortingState.set([]),

    setGlobalFilter: (q) => {
      globalFilterState.set(q);
      paginationState.update(p => ({ ...p, pageIndex: 0 }));
    },
    setColumnFilter: (id, q) => {
      columnFiltersState.update(f => ({ ...f, [id]: q }));
      paginationState.update(p => ({ ...p, pageIndex: 0 }));
    },
    clearFilters: () => {
      globalFilterState.set('');
      columnFiltersState.set({});
      paginationState.update(p => ({ ...p, pageIndex: 0 }));
    },

    setPageIndex: (i) => paginationState.update(p => ({ ...p, pageIndex: clampPageIndex(i, pageCount()) })),
    setPageSize: (s) => paginationState.update(p => ({ ...p, pageSize: s, pageIndex: 0 })),
    nextPage: () => paginationState.update(p => ({ ...p, pageIndex: clampPageIndex(p.pageIndex + 1, pageCount()) })),
    previousPage: () => paginationState.update(p => ({ ...p, pageIndex: Math.max(0, p.pageIndex - 1) })),
    firstPage: () => paginationState.update(p => ({ ...p, pageIndex: 0 })),
    lastPage: () => paginationState.update(p => ({ ...p, pageIndex: pageCount() - 1 })),

    toggleRowSelection: (id) => selectionState.update(s => toggleId(s, id)),
    setRowSelected: (id, selected) => {
      selectionState.update(s => {
        const next = new Set(s);
        if (selected) next.add(id);
        else next.delete(id);
        return next;
      });
    },
    isRowSelected: (id) => selectionState().has(id),
    toggleAllPageRows: () => selectionState.update(s => togglePageIds(s, rows().map(r => r.id))),
    clearSelection: () => selectionState.set(new Set()),

    setColumnVisibility: (id, visible) => hiddenColumnsState.update(s => {
      const next = new Set(s);
      if (visible) next.delete(id);
      else next.add(id);
      return next;
    }),
    toggleColumnVisibility: (id) => hiddenColumnsState.update(s => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    }),
    isColumnVisible: (id) => {
      const col = allColumns().find(c => c.id === id);
      return col ? !col.hidden : false;
    },

    cellValue: (row, id) => {
      const col = allColumns().find(c => c.id === id);
      if (!col) return undefined;
      return col.accessor ? col.accessor(row.data) : (row.data as any)[id];
    },
    cellText: (row, id) => {
      const col = allColumns().find(c => c.id === id);
      if (!col) return '';
      const val = api.cellValue(row, id);
      if (col.formatter) return col.formatter(val, row.data);
      return val === null || val === undefined ? '' : String(val);
    },

    setState: (s) => {
      if (s.sorting !== undefined) sortingState.set(s.sorting);
      if (s.globalFilter !== undefined) globalFilterState.set(s.globalFilter);
      if (s.columnFilters !== undefined) columnFiltersState.set(s.columnFilters);
      if (s.pagination !== undefined) paginationState.set(s.pagination);
      if (s.selection !== undefined) selectionState.set(s.selection);
      if (s.hiddenColumns !== undefined) hiddenColumnsState.set(s.hiddenColumns);
    },
    state
  };

  return api;
}
