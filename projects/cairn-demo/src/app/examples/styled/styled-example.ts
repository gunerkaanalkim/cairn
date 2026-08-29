import { Component, signal } from '@angular/core';
import { createTable } from '@guneralkim/cairn-datatable/core';
import { DataTable } from '@guneralkim/cairn-datatable';
import { DATA, COLUMNS } from '../../shared/sample-data';
import { ExampleShell } from '../../shared/example-shell';

@Component({
  selector: 'app-styled-example',
  standalone: true,
  imports: [DataTable, ExampleShell],
  template: `
    <app-example-shell title="Styled Example">
      <cairn-data-table [table]="tableApi" />
    </app-example-shell>
  `
})
export class StyledExample {
  data = signal(DATA);
  columns = signal(COLUMNS);
  tableApi = createTable({ data: this.data, columns: this.columns });
}
