import { Component, input } from '@angular/core';
import type { TableApi } from '@gunerkaanalkim/cairn-datatable/core';

@Component({
  selector: 'app-example-shell',
  standalone: true,
  template: `
    <div style="margin-bottom: 2rem; border: 1px solid #ccc; padding: 1rem;">
      <h2>{{ title() }}</h2>
      @if (table(); as t) {
        <div style="margin-bottom: 1rem;">
          <input (input)="t.setGlobalFilter($any($event.target).value)" placeholder="Global Filter..." />
        </div>
      }
      <div style="margin-top: 1rem;">
        <ng-content></ng-content>
      </div>
      @if (table(); as t) {
        <div style="margin-top: 1rem; display: flex; gap: 1rem; align-items: center;">
          <button (click)="t.firstPage()" [disabled]="t.pagination().pageIndex === 0">&lt;&lt;</button>
          <button (click)="t.previousPage()" [disabled]="t.pagination().pageIndex === 0">&lt;</button>
          <span>Page {{ t.pagination().pageIndex + 1 }} of {{ t.pageCount() }}</span>
          <button (click)="t.nextPage()" [disabled]="t.pagination().pageIndex >= t.pageCount() - 1">&gt;</button>
          <button (click)="t.lastPage()" [disabled]="t.pagination().pageIndex >= t.pageCount() - 1">&gt;&gt;</button>
          <span style="margin-left: 1rem;">{{ t.selectedRows().length }} rows selected</span>
        </div>
      }
    </div>
  `
})
export class ExampleShell {
  readonly title = input.required<string>();
  readonly table = input<TableApi<any>>();
}
