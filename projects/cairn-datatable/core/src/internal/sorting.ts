import { ColumnDef, Row, SortState } from '../types';
import { readCellValue } from './filtering';

export function defaultComparator(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a === null || a === undefined) return 1;
  if (b === null || b === undefined) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b));
}

export function applySorting<T>(
  rows: readonly Row<T>[],
  columns: readonly ColumnDef<T>[],
  sorting: readonly SortState[],
  fallback: (a: unknown, b: unknown) => number,
): readonly Row<T>[] {
  if (sorting.length === 0) return rows;

  return [...rows].sort((rowA, rowB) => {
    for (const sort of sorting) {
      const col = columns.find(c => c.id === sort.id);
      if (!col) continue;

      const a = readCellValue(rowA.data, col);
      const b = readCellValue(rowB.data, col);

      let result = 0;
      const aNullish = a === null || a === undefined;
      const bNullish = b === null || b === undefined;
      
      if (aNullish && bNullish) {
        result = 0;
      } else if (aNullish) {
        result = 1;
      } else if (bNullish) {
        result = -1;
      } else {
        if (col.sortFn) {
          result = col.sortFn(a, b, rowA.data, rowB.data);
        } else {
          result = fallback(a, b);
        }
        if (sort.direction === 'desc') {
          result *= -1;
        }
      }
      
      if (result !== 0) return result;
    }
    return rowA.sourceIndex - rowB.sourceIndex;
  });
}
