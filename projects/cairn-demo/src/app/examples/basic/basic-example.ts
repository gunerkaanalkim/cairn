import { Component, signal } from '@angular/core';
import { createTable } from '@guneralkim/cairn-datatable/core';
import { DataTable } from '@guneralkim/cairn-datatable';
import { DATA, COLUMNS } from '../../shared/sample-data';
import { ExampleShell } from '../../shared/example-shell';

@Component({
  selector: 'app-basic-example',
  standalone: true,
  imports: [DataTable, ExampleShell],
  template: `
    <app-example-shell title="Basic Example">
      <cairn-data-table [table]="tableApi" />
      <div>
        <button (click)="tableApi.previousPage()">Prev</button>
        <button (click)="tableApi.nextPage()">Next</button>
      </div>
    </app-example-shell>
  `
})
export class BasicExample {
  data = signal(DATA);
  columns = signal(COLUMNS);
  tableApi = createTable({ data: this.data, columns: this.columns });
}
