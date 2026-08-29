import { Component, signal } from '@angular/core';
import { createTable } from '@gunerkaanalkim/cairn-datatable/core';
import { DATA, COLUMNS } from '../../shared/sample-data';
import { ExampleShell } from '../../shared/example-shell';

@Component({
  selector: 'app-headless-example',
  standalone: true,
  imports: [ExampleShell],
  templateUrl: './headless-example.html'
})
export class HeadlessExample {
  data = signal(DATA);
  columns = signal(COLUMNS);
  tableApi = createTable({ data: this.data, columns: this.columns });
}
