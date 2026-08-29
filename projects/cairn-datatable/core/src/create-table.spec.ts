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
});
