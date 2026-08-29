import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideZonelessChangeDetection, Component, signal } from '@angular/core';
import { DataTable } from './data-table';
import { createTable } from '@guneralkim/cairn-datatable/core';

@Component({
  standalone: true,
  imports: [DataTable],
  template: `<cairn-data-table [table]="api" />`
})
class TestHost {
  data = signal([{id: 1}]);
  columns = signal([{id: 'id', header: 'ID'}]);
  api = createTable({ data: this.data, columns: this.columns });
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
