import { Row, RowId } from '../types';

export function markSelected<T>(
  rows: readonly Row<T>[],
  selection: ReadonlySet<RowId>,
): readonly Row<T>[] {
  if (selection.size === 0) return rows.map(r => r.selected ? { ...r, selected: false } : r);
  
  return rows.map(row => {
    const selected = selection.has(row.id);
    if (row.selected === selected) return row;
    return { ...row, selected };
  });
}

export function toggleId(selection: ReadonlySet<RowId>, id: RowId): ReadonlySet<RowId> {
  const next = new Set(selection);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  return next;
}

export function togglePageIds(
  selection: ReadonlySet<RowId>,
  pageIds: readonly RowId[],
): ReadonlySet<RowId> {
  const next = new Set(selection);
  let allSelected = true;
  for (const id of pageIds) {
    if (!next.has(id)) {
      allSelected = false;
      break;
    }
  }

  if (allSelected) {
    for (const id of pageIds) {
      next.delete(id);
    }
  } else {
    for (const id of pageIds) {
      next.add(id);
    }
  }
  
  return next;
}
