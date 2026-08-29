import { Component, signal } from '@angular/core';
import { createTable } from '@gunerkaanalkim/cairn-datatable/core';
import { DataTable, CairnClassNames } from '@gunerkaanalkim/cairn-datatable';
import { DATA, COLUMNS } from '../../shared/sample-data';
import { ExampleShell } from '../../shared/example-shell';

@Component({
  selector: 'app-tailwind-example',
  standalone: true,
  imports: [DataTable, ExampleShell],
  templateUrl: './tailwind-example.html'
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
