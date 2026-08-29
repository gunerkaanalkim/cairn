import { applySorting, defaultComparator } from './sorting';

describe('sorting', () => {
  it('should sort ascending and descending correctly', () => {
    const data = [{ id: 1, val: 3 }, { id: 2, val: 1 }, { id: 3, val: 2 }];
    const rows = data.map((d, i) => ({ id: d.id, sourceIndex: i, data: d, selected: false }));
    const cols = [{ id: 'val', header: 'Val' }];
    
    let res = applySorting(rows, cols, [{ id: 'val', direction: 'asc' }], defaultComparator);
    expect(res.map(r => r.id)).toEqual([2, 3, 1]);
    
    res = applySorting(rows, cols, [{ id: 'val', direction: 'desc' }], defaultComparator);
    expect(res.map(r => r.id)).toEqual([1, 3, 2]);
  });

  it('should sort null and undefined to the end in both directions', () => {
    const data = [
      { id: 1, val: null },
      { id: 2, val: 'b' },
      { id: 3, val: undefined },
      { id: 4, val: 'a' }
    ];
    const rows = data.map((d, i) => ({ id: d.id, sourceIndex: i, data: d, selected: false }));
    const cols = [{ id: 'val', header: 'Val' }];

    let res = applySorting(rows, cols, [{ id: 'val', direction: 'asc' }], defaultComparator);
    expect(res.map(r => r.id)).toEqual([4, 2, 1, 3]);

    res = applySorting(rows, cols, [{ id: 'val', direction: 'desc' }], defaultComparator);
    expect(res.map(r => r.id)).toEqual([2, 4, 1, 3]);
  });

  it('should prioritize the first item in multi-sort and preserve sourceIndex on tie', () => {
    const data = [
      { id: 1, g: 2, val: 'x' },
      { id: 2, g: 1, val: 'b' },
      { id: 3, g: 1, val: 'a' },
      { id: 4, g: 1, val: 'b' }
    ];
    const rows = data.map((d, i) => ({ id: d.id, sourceIndex: i, data: d, selected: false }));
    const cols = [{ id: 'g', header: 'G' }, { id: 'val', header: 'Val' }];

    const res = applySorting(rows, cols, [
      { id: 'g', direction: 'asc' },
      { id: 'val', direction: 'asc' }
    ], defaultComparator);
    
    expect(res.map(r => r.id)).toEqual([3, 2, 4, 1]);
  });
});
