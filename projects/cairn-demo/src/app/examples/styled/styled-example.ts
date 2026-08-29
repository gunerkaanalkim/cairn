import { Component, signal } from '@angular/core';
import { createTable } from '@gunerkaanalkim/cairn-datatable/core';
import { DataTable } from '@gunerkaanalkim/cairn-datatable';
import { DATA, COLUMNS } from '../../shared/sample-data';
import { ExampleShell } from '../../shared/example-shell';

@Component({
  selector: 'app-styled-example',
  standalone: true,
  imports: [DataTable, ExampleShell],
  templateUrl: './styled-example.html'
})
export class StyledExample {
  data = signal(DATA);
  columns = signal(COLUMNS);
  tableApi = createTable({ data: this.data, columns: this.columns });
}
