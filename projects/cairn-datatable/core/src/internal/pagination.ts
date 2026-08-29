import { PaginationState, Row } from '../types';

export function clampPageIndex(pageIndex: number, pageCount: number): number {
  if (pageCount <= 0) return 0;
  return Math.max(0, Math.min(pageIndex, pageCount - 1));
}

export function applyPagination<T>(
  rows: readonly Row<T>[],
  pagination: PaginationState,
): readonly Row<T>[] {
  const start = pagination.pageIndex * pagination.pageSize;
  return rows.slice(start, start + pagination.pageSize);
}
