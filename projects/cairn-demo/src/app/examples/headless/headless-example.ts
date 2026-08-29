import { Component, signal } from '@angular/core';
import { createTable } from '@guneralkim/cairn-datatable/core';
import { DATA, COLUMNS } from '../../shared/sample-data';
import { ExampleShell } from '../../shared/example-shell';

@Component({
  selector: 'app-headless-example',
  standalone: true,
  imports: [ExampleShell],
  template: `
    <app-example-shell title="Headless Example">
      <div style="display: grid; gap: 1rem;">
        @for(row of tableApi.rows(); track row.id) {
          <div style="border: 1px solid black; padding: 1rem;">
            <strong>{{ tableApi.cellText(row, 'name') }}</strong> - {{ tableApi.cellText(row, 'role') }}
          </div>
        }
      </div>
    </app-example-shell>
  `
})
export class HeadlessExample {
  data = signal(DATA);
  columns = signal(COLUMNS);
  tableApi = createTable({ data: this.data, columns: this.columns });
}
