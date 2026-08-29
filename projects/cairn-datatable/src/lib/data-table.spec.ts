import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideZonelessChangeDetection, Component, signal } from '@angular/core';
import { DataTable } from './data-table';
import { createTable } from '@gunerkaanalkim/cairn-datatable/core';
import { CairnCell } from './directives/cell-template';
import { CairnEmpty } from './directives/empty-template';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [DataTable, CairnCell, CairnEmpty],
  template: `
    <cairn-data-table 
      [table]="api" 
      [classNames]="classes()" 
      [caption]="captionText()" 
      [loading]="isLoading()"
      [selectable]="isSelectable()"
    >
      <ng-template cairnCell="custom">
        <span class="custom-span">Custom Content</span>
      </ng-template>
      @if (showCustomEmpty()) {
        <ng-template cairnEmpty>
          <div class="custom-empty">Custom Empty</div>
        </ng-template>
      }
    </cairn-data-table>
  `
})
class TestHost {
  data = signal<any[]>([{id: 1, custom: 'a'}, {id: 2, custom: 'b'}]);
  columns = signal([{id: 'id', header: 'ID'}, {id: 'custom', header: 'Custom'}]);
  api = createTable({ data: this.data, columns: this.columns, rowId: (r) => r.id });
  
  classes = signal<any>({});
  captionText = signal('');
  isLoading = signal(false);
  isSelectable = signal(false);
  showCustomEmpty = signal(false);
}

describe('DataTable', () => {
  let fixture: ComponentFixture<TestHost>;
  let component: TestHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost, DataTable],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('1. should create and render th elements equal to column count', async () => {
    const ths = fixture.debugElement.queryAll(By.css('th'));
    expect(ths.length).toBe(2);
  });

  it('2. should toggle sorting and update aria-sort on header button click', async () => {
    const button = fixture.debugElement.query(By.css('th button'));
    button.nativeElement.click();
    await fixture.whenStable();
    
    const th = fixture.debugElement.query(By.css('th'));
    expect(th.attributes['aria-sort']).toBe('ascending');
  });

  it('3. should apply user classes from classNames input to table, cell, row states and header sort', async () => {
    component.classes.set({ 
      table: 'my-table', 
      cell: 'my-cell', 
      rowSelected: 'my-selected', 
      rowEven: 'my-even', 
      rowOdd: 'my-odd',
      headerCellSorted: 'my-sorted-header'
    });
    
    await fixture.whenStable();
    
    const table = fixture.debugElement.query(By.css('table'));
    expect(table.classes['my-table']).toBe(true);
    
    const cells = fixture.debugElement.queryAll(By.css('td.cairn-cell'));
    expect(cells[0].classes['my-cell']).toBe(true);

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows[0].classes['my-even']).toBe(true);
    expect(rows[1].classes['my-odd']).toBe(true);

    // Select row 1
    component.api.toggleRowSelection(1);
    await fixture.whenStable();
    const rowsAfterSelect = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rowsAfterSelect[0].classes['my-selected']).toBe(true);

    // Sort column 1
    component.api.toggleSort('id');
    await fixture.whenStable();
    const th = fixture.debugElement.query(By.css('th'));
    expect(th.classes['my-sorted-header']).toBe(true);
  });

  it('4. should render custom cell template only for the targeted column', async () => {
    const customSpans = fixture.debugElement.queryAll(By.css('.custom-span'));
    expect(customSpans.length).toBe(2); // 2 rows, 1 custom column
    
    const standardCells = fixture.debugElement.queryAll(By.css('td.cairn-cell'));
    // The first column should just have text
    expect(standardCells[0].nativeElement.textContent.trim()).toBe('1');
  });

  it('5. should render default or custom empty state when data is empty', async () => {
    component.data.set([]);
    await fixture.whenStable();
    
    let emptyCell = fixture.debugElement.query(By.css('.cairn-empty-cell'));
    expect(emptyCell.nativeElement.textContent.trim()).toBe('No records found'); // DEFAULT_EMPTY_MESSAGE

    component.showCustomEmpty.set(true);
    await fixture.whenStable();
    const customEmpty = fixture.debugElement.query(By.css('.custom-empty'));
    expect(customEmpty).toBeTruthy();
  });

  it('6. should add aria-busy and hide rows when loading is true', async () => {
    component.isLoading.set(true);
    await fixture.whenStable();
    
    const tbody = fixture.debugElement.query(By.css('tbody'));
    expect(tbody.attributes['aria-busy']).toBe('true');
    
    const rows = fixture.debugElement.queryAll(By.css('.cairn-row'));
    expect(rows.length).toBe(0);
    
    const loadingCell = fixture.debugElement.query(By.css('.cairn-loading-cell'));
    expect(loadingCell).toBeTruthy();
  });

  it('7. should only render caption element if caption input is provided', async () => {
    let captionEl = fixture.debugElement.query(By.css('caption'));
    expect(captionEl).toBeNull();
    
    component.captionText.set('My Caption');
    await fixture.whenStable();
    
    captionEl = fixture.debugElement.query(By.css('caption'));
    expect(captionEl.nativeElement.textContent.trim()).toBe('My Caption');
  });

  it('8. should select row when selection checkbox is clicked', async () => {
    component.isSelectable.set(true);
    await fixture.whenStable();
    
    const checkbox = fixture.debugElement.query(By.css('td.cairn-selection-cell input'));
    checkbox.nativeElement.click();
    await fixture.whenStable();
    
    expect(component.api.isRowSelected(1)).toBe(true);
  });
});
