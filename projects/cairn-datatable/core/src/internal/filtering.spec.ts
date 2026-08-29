import { applyFilters, defaultFilterPredicate } from './filtering';
import { ColumnDef, Row } from '../types';

describe('filtering', () => {
  it('should filter correctly', () => {
    const data = [{ id: 1, val: 'foo' }, { id: 2, val: 'bar' }];
    const rows = data.map((d, i) => ({ id: d.id, sourceIndex: i, data: d, selected: false }));
    const cols: ColumnDef<any>[] = [{ id: 'val', header: 'Val' }];
    
    const res = applyFilters(rows, cols, 'foo', {}, defaultFilterPredicate);
    expect(res.length).toBe(1);
    expect(res[0].id).toBe(1);
  });
});
