import { toggleId, togglePageIds } from './selection';
import type { RowId } from '../types';

describe('selection', () => {
  it('should not mutate the source set in toggleId', () => {
    const source = new Set([1, 2]);
    const res = toggleId(source, 2);
    expect(source.has(2)).toBe(true);
    expect(res.has(2)).toBe(false);
  });

  it('should select all given ids unless all are already selected, leaving other pages intact', () => {
    let selectedIds: ReadonlySet<RowId> = new Set([1]);
    selectedIds = togglePageIds(selectedIds, [2, 3]);
    expect(Array.from(selectedIds).sort()).toEqual([1, 2, 3]);

    selectedIds = new Set([1, 2, 5]);
    selectedIds = togglePageIds(selectedIds, [2, 3]);
    expect(Array.from(selectedIds).sort()).toEqual([1, 2, 3, 5]);

    selectedIds = new Set([1, 2, 3]);
    selectedIds = togglePageIds(selectedIds, [2, 3]);
    expect(Array.from(selectedIds).sort()).toEqual([1]);
  });
});
