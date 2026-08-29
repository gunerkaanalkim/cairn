import { applySorting, defaultComparator } from './sorting';

describe('sorting', () => {
  it('should sort nulls to the end', () => {
    const data = [{ id: 1, val: null }, { id: 2, val: 'a' }];
    const rows = data.map((d, i) => ({ id: d.id, sourceIndex: i, data: d, selected: false }));
    const res = applySorting(rows, [{ id: 'val', header: 'Val' }], [{ id: 'val', direction: 'asc' }], defaultComparator);
    expect(res[0].id).toBe(2);
    expect(res[1].id).toBe(1);
  });
});
