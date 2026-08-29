import { Row, RowId } from '../types';

export function buildRows<T>(
  data: readonly T[],
  rowId: (row: T, index: number) => RowId,
): readonly Row<T>[] {
  return data.map((row, index) => ({
    id: rowId(row, index),
    data: row,
    sourceIndex: index,
    selected: false
  }));
}
