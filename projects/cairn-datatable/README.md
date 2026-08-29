# Cairn DataTable
A headless, signal-based datatable for Angular.

## Installation
\`\`\`bash
npm install @guneralkim/cairn-datatable
\`\`\`

## Usage
\`\`\`typescript
import { Component, signal } from '@angular/core';
import { createTable } from '@guneralkim/cairn-datatable/core';
import { DataTable } from '@guneralkim/cairn-datatable';

@Component({
  standalone: true,
  imports: [DataTable],
  template: \`<cairn-data-table [table]="api" />\`
})
export class App {
  api = createTable({
    data: signal([{id: 1, name: 'A'}]),
    columns: signal([{id: 'name', header: 'Name'}])
  });
}
\`\`\`

\`\`\`css
@import '@guneralkim/cairn-datatable/styles/cairn-datatable.css';
\`\`\`

## Roadmap
V2 will include row spanning.
