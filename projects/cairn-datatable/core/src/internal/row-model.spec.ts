import { buildRows } from './row-model';

describe('row-model', () => {
  it('should build rows correctly', () => {
    const data = [{ id: 1, name: 'A' }];
    const rows = buildRows(data, r => r.id);
    expect(rows[0].id).toBe(1);
    expect(rows[0].sourceIndex).toBe(0);
    expect(rows[0].selected).toBe(false);
    expect(rows[0].data).toBe(data[0]);
  });
});
