import { Component, signal } from '@angular/core';
import { createTable } from '@guneralkim/cairn-datatable/core';
import { DataTable, CairnClassNames } from '@guneralkim/cairn-datatable';
import { DATA, COLUMNS } from '../../shared/sample-data';
import { ExampleShell } from '../../shared/example-shell';

@Component({
  selector: 'app-tailwind-example',
  standalone: true,
  imports: [DataTable, ExampleShell],
  template: `
    <app-example-shell title="Tailwind Example">
      <cairn-data-table [table]="tableApi" [classNames]="classes" />
    </app-example-shell>
  `
})
export class TailwindExample {
  data = signal(DATA);
  columns = signal(COLUMNS);
  tableApi = createTable({ data: this.data, columns: this.columns });
  classes: CairnClassNames = {
    table: 'w-full text-left border-collapse',
    headerCell: 'bg-gray-100 p-2 border-b',
    cell: 'p-2 border-b',
    rowEven: 'bg-gray-50'
  };
}
