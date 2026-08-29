import { applyPagination, clampPageIndex } from './pagination';

describe('pagination', () => {
  it('should clamp', () => {
    expect(clampPageIndex(5, 2)).toBe(1);
    expect(clampPageIndex(-1, 2)).toBe(0);
    expect(clampPageIndex(0, 0)).toBe(0);
  });
  it('should paginate', () => {
    const rows: any[] = [1, 2, 3, 4, 5];
    expect(applyPagination(rows, { pageIndex: 1, pageSize: 2 }).length).toBe(2);
  });
});
