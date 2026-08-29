import { createTable } from './create-table';
import { signal } from '@angular/core';

describe('createTable', () => {
  it('should not re-run sortFn on pagination change', () => {
    let sortCount = 0;
    const data = signal([{ id: 1 }, { id: 2 }, { id: 3 }]);
    const columns = signal([{ 
      id: 'id', 
      header: 'ID', 
      sortFn: (a: any, b: any) => { sortCount++; return a - b; } 
    }]);

    const api = createTable({ data, columns, rowId: (r) => r.id });
    api.toggleSort('id'); // asc
    // Computed signals are lazy; force the chain to evaluate before reading the counter.
    api.rows();
    
    const countAfterSort = sortCount;
    expect(countAfterSort).toBeGreaterThan(0);
    
    // Check initial page
    api.setPageSize(1);
    expect(api.rows().length).toBe(1);
    
    sortCount = 0;
    api.setPageIndex(1);
    expect(api.rows().length).toBe(1);
    expect(api.rows()[0].id).toBe(2);
    
    // Sort count shouldn't have increased just because of pagination change
    expect(sortCount).toBe(0);
  });

  it('should not apply column filter to a hidden column', () => {
    const data = signal([{ id: 1, val: 'foo' }, { id: 2, val: 'bar' }]);
    const columns = signal([{ id: 'val', header: 'Val', hidden: true }]);
    const api = createTable({ data, columns, rowId: (r) => r.id });
    
    // Note: columnFilters operate on column entries regardless of visibility. 
    // Wait, applyFilters does: `const col = columns.find(c => c.id === colId);` where columns is visibleColumnList().
    // If hidden, it shouldn't apply filter.
    api.setColumnFilter('val', 'foo');
    expect(api.rows().length).toBe(2); // Filter not applied because column is hidden
  });

  it('should reset page index when filter changes', () => {
    const data = signal(Array.from({length: 20}, (_, i) => ({ id: i, name: 'A' })));
    const columns = signal([{ id: 'name', header: 'Name' }]);
    const api = createTable({ data, columns, rowId: (r) => r.id });
    
    api.setPageSize(5);
    api.setPageIndex(2); // Page 3
    expect(api.pagination().pageIndex).toBe(2);
    
    api.setGlobalFilter('A');
    expect(api.pagination().pageIndex).toBe(0);
  });

  it('should restore state with setState', () => {
    const data = signal([{ id: 1 }, { id: 2 }]);
    const columns = signal([{ id: 'id', header: 'ID' }]);
    const api = createTable({ data, columns, rowId: (r) => r.id });
    
    api.setState({
      pagination: { pageIndex: 1, pageSize: 1 },
      globalFilter: 'foo',
      hiddenColumns: new Set(['id'])
    });
    
    expect(api.pagination().pageIndex).toBe(1);
    expect(api.globalFilter()).toBe('foo');
    expect(api.isColumnVisible('id')).toBe(false);
  });

  it('should not allow sorting on sortable: false column', () => {
    const data = signal([{ id: 1, val: 'a' }, { id: 2, val: 'b' }]);
    const columns = signal([{ id: 'val', header: 'Val', sortable: false }]);
    const api = createTable({ data, columns, rowId: (r) => r.id });
    
    api.toggleSort('val');
    expect(api.sorting().length).toBe(0);
  });

  it('should preserve sorting even if the sorted column is hidden', () => {
    const data = signal([{ id: 3 }, { id: 1 }, { id: 2 }]);
    const columns = signal([{ id: 'id', header: 'ID' }]);
    const api = createTable({ data, columns, rowId: (r) => r.id });
    
    api.toggleSort('id'); // asc
    expect(api.rows().map(r => r.id)).toEqual([1, 2, 3]);
    
    api.setColumnVisibility('id', false); // hide column
    expect(api.rows().map(r => r.id)).toEqual([1, 2, 3]); // still sorted
  });
});
