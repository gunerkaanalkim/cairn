import { applyFilters, defaultFilterPredicate } from './filtering';
import { ColumnDef } from '../types';

describe('filtering', () => {
  it('should match global filter in any column', () => {
    const data = [{ id: 1, a: 'foo', b: 'bar' }, { id: 2, a: 'baz', b: 'qux' }];
    const rows = data.map((d, i) => ({ id: d.id, sourceIndex: i, data: d, selected: false }));
    const cols: ColumnDef<any>[] = [{ id: 'a', header: 'A' }, { id: 'b', header: 'B' }];
    
    let res = applyFilters(rows, cols, 'foo', {}, defaultFilterPredicate);
    expect(res.map(r => r.id)).toEqual([1]);
    
    res = applyFilters(rows, cols, 'qux', {}, defaultFilterPredicate);
    expect(res.map(r => r.id)).toEqual([2]);
  });

  it('should combine column filters with AND logic', () => {
    const data = [
      { id: 1, a: 'foo', b: 'bar' },
      { id: 2, a: 'foo', b: 'qux' }
    ];
    const rows = data.map((d, i) => ({ id: d.id, sourceIndex: i, data: d, selected: false }));
    const cols: ColumnDef<any>[] = [{ id: 'a', header: 'A' }, { id: 'b', header: 'B' }];

    const res = applyFilters(rows, cols, '', { a: 'foo', b: 'qux' }, defaultFilterPredicate);
    expect(res.map(r => r.id)).toEqual([2]);
  });

  it('should ignore columns with globallyFilterable: false in global search', () => {
    const data = [{ id: 1, a: 'secret', b: 'public' }, { id: 2, a: 'public', b: 'other' }];
    const rows = data.map((d, i) => ({ id: d.id, sourceIndex: i, data: d, selected: false }));
    const cols: ColumnDef<any>[] = [
      { id: 'a', header: 'A', globallyFilterable: false },
      { id: 'b', header: 'B' }
    ];

    const res = applyFilters(rows, cols, 'secret', {}, defaultFilterPredicate);
    expect(res.length).toBe(0);
  });

  it('should ignore column filters for columns with filterable: false', () => {
    const data = [{ id: 1, a: 'foo' }, { id: 2, a: 'bar' }];
    const rows = data.map((d, i) => ({ id: d.id, sourceIndex: i, data: d, selected: false }));
    const cols: ColumnDef<any>[] = [{ id: 'a', header: 'A', filterable: false }];

    const res = applyFilters(rows, cols, '', { a: 'foo' }, defaultFilterPredicate);
    expect(res.length).toBe(2);
  });
});
