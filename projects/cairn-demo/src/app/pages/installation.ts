import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CodeBlock } from '../ui/code-block';
import { DocsPage } from '../ui/docs-page';
import { Prose } from '../ui/prose';

@Component({
  selector: 'app-installation',
  imports: [RouterLink, CodeBlock, DocsPage, Prose],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page
      eyebrow="Getting started"
      heading="Installation"
      lead="One package, two entry points and an optional stylesheet."
    >
      <docs-prose>
        <h2>1. Install the package</h2>
      </docs-prose>
      <docs-code [code]="install" lang="bash" title="terminal" />

      <docs-prose>
        <h2>2. Check the peer range</h2>
        <ol>
          <li>Angular <code>^21.0.0 || ^22.0.0</code> is required, both for <code>@angular/core</code> and <code>@angular/common</code>.</li>
          <li>Zoneless change detection is not mandatory, but the library is written for it and behaves best without zone.js.</li>
          <li>No other runtime dependency is installed. The package declares no dependencies at all.</li>
        </ol>

        <h2>3. Import the optional stylesheet</h2>
        <p>
          Without this import the table renders as a completely unstyled HTML table. That is a
          supported mode, not a broken one. See <a routerLink="/styling">Styling</a> for the three
          ways to dress it up.
        </p>
      </docs-prose>
      <docs-code [code]="styles" lang="css" title="styles.css" />

      <docs-prose>
        <p>
          The default rules live inside the <code>&#64;layer cairn</code> cascade layer, so any rule you
          write outside a layer wins without needing a higher specificity.
        </p>

        <h2>4. Render a table</h2>
        <p>
          <code>createTable</code> comes from the <code>/core</code> entry point and the component
          from the root entry point. Importing only <code>/core</code> keeps the component and its
          template out of your bundle.
        </p>
      </docs-prose>
      <docs-code [code]="usage" lang="ts" title="app.ts" />

      <docs-prose>
        <h2>Server side rendering</h2>
        <p>
          The core layer touches no browser API, so it runs unchanged on the server. The component
          layer renders plain table markup and only reads the DOM through Angular bindings. Nothing
          extra is needed for SSR (Server Side Rendering).
        </p>
      </docs-prose>
    </docs-page>
  `,
})
export class InstallationPage {
  protected readonly install = 'npm install @gunerkaanalkim/cairn-datatable';

  protected readonly styles = `@import '@gunerkaanalkim/cairn-datatable/styles/cairn-datatable.css';`;

  protected readonly usage = `
import { Component, signal } from '@angular/core';
import { DataTable } from '@gunerkaanalkim/cairn-datatable';
import { createTable, type ColumnDef } from '@gunerkaanalkim/cairn-datatable/core';

interface Person {
  id: number;
  name: string;
  role: string;
}

@Component({
  selector: 'app-root',
  imports: [DataTable],
  template: '<cairn-data-table [table]="table" />',
})
export class App {
  readonly data = signal<Person[]>([
    { id: 1, name: 'Ada Adler', role: 'Owner' },
    { id: 2, name: 'Bruno Costa', role: 'Editor' },
  ]);

  readonly columns = signal<ColumnDef<Person>[]>([
    { id: 'name', header: 'Name' },
    { id: 'role', header: 'Role' },
  ]);

  readonly table = createTable({
    data: this.data,
    columns: this.columns,
    rowId: (row) => row.id,
  });
}
`;
}
