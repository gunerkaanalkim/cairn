import { ColumnDef, Row } from '../types';

export function readCellValue<T>(row: T, column: ColumnDef<T>): unknown {
  if (column.accessor) {
    return column.accessor(row);
  }
  return (row as any)[column.id];
}

export function defaultFilterPredicate(value: unknown, query: string): boolean {
  if (value == null) return false;
  return String(value).toLowerCase().includes(query.toLowerCase());
}

export function applyFilters<T>(
  rows: readonly Row<T>[],
  columns: readonly ColumnDef<T>[],
  globalFilter: string,
  columnFilters: Readonly<Record<string, string>>,
  fallback: (value: unknown, query: string) => boolean,
): readonly Row<T>[] {
  if (!globalFilter && Object.keys(columnFilters).length === 0) {
    return rows;
  }
  
  return rows.filter(row => {
    for (const [colId, query] of Object.entries(columnFilters)) {
      if (!query) continue;
      const col = columns.find(c => c.id === colId);
      if (!col || col.filterable === false) continue;
      
      const val = readCellValue(row.data, col);
      const predicate = col.filterFn ?? fallback;
      if (!predicate(val, query, row.data)) {
        return false;
      }
    }

    if (globalFilter) {
      let matchGlobal = false;
      for (const col of columns) {
        if (col.globallyFilterable === false) continue;
        
        const val = readCellValue(row.data, col);
        const predicate = col.filterFn ?? fallback;
        if (predicate(val, globalFilter, row.data)) {
          matchGlobal = true;
          break;
        }
      }
      if (!matchGlobal) return false;
    }

    return true;
  });
}
