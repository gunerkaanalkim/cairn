import { markSelected, toggleId, togglePageIds } from './selection';

describe('selection', () => {
  it('should mark selected', () => {
    const res = markSelected([{ id: 1, selected: false } as any], new Set([1]));
    expect(res[0].selected).toBe(true);
  });
});
