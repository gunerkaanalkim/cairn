import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTable } from '@gunerkaanalkim/cairn-datatable';
import { createTable } from '@gunerkaanalkim/cairn-datatable/core';
import { BASIC_COLUMNS, EMPLOYEES } from '../shared/sample-data';
import { CodeBlock } from '../ui/code-block';
import { DemoPager } from '../ui/demo-pager';
import { DocsPage } from '../ui/docs-page';
import { Prose } from '../ui/prose';

const QUICK_START = `
import { Component, signal } from '@angular/core';
import { DataTable } from '@gunerkaanalkim/cairn-datatable';
import { createTable } from '@gunerkaanalkim/cairn-datatable/core';

@Component({
  selector: 'app-people',
  imports: [DataTable],
  template: '<cairn-data-table [table]="table" [selectable]="true" />',
})
export class People {
  readonly data = signal([
    { name: 'Ada Adler', email: 'ada.adler@cairn.dev', role: 'Owner' },
  ]);

  readonly columns = signal([
    { id: 'name', header: 'Name' },
    { id: 'email', header: 'Email' },
    { id: 'role', header: 'Role' },
  ]);

  readonly table = createTable({ data: this.data, columns: this.columns });
}
`;

@Component({
  selector: 'app-introduction',
  imports: [DataTable, RouterLink, CodeBlock, DemoPager, DocsPage, Prose],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page
      [showLogo]="true"
      eyebrow="Cairn DataTable"
      heading="A datatable that gets out of your way"
      lead="Signal based, zoneless and free of runtime dependencies. The logic layer is a plain factory function, the component layer is optional, and every element it renders is yours to style."
    >
      <docs-prose>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <h3 class="mt-0">Zero runtime dependencies</h3>
            <p class="mb-0 text-sm">
              The published package pulls in nothing but Angular itself. No zone.js, no CDK, no
              helper library.
            </p>
          </div>
          <div class="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <h3 class="mt-0">Two layers, one API</h3>
            <p class="mb-0 text-sm">
              <code>createTable</code> owns the state and the derivation chain.
              <code>cairn-data-table</code> is a thin renderer you can replace entirely.
            </p>
          </div>
          <div class="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <h3 class="mt-0">Precise reactivity</h3>
            <p class="mb-0 text-sm">
              Filtering, sorting and pagination are separate <code>computed</code> stages. Changing
              the page never re-runs the sort.
            </p>
          </div>
          <div class="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <h3 class="mt-0">Unopinionated styling</h3>
            <p class="mb-0 text-sm">
              Import the optional stylesheet, pass your own class names, or target the
              <code>data-*</code> attributes with plain CSS.
            </p>
          </div>
        </div>

        <h2>See it running</h2>
        <p>
          The table below is the component layer with sorting, selection and pagination enabled. Click
          a header to sort, hold <strong>Shift</strong> while clicking to sort by several columns.
        </p>
      </docs-prose>

      <div class="my-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <cairn-data-table [table]="table" [selectable]="true" caption="Team members" />
      </div>
      <docs-pager [table]="table" [showSelection]="true" />

      <docs-prose>
        <h2>The whole setup</h2>
        <p>
          There is no module to import, no service to register and no configuration object to learn.
          A signal of rows, a signal of columns, and the factory returns a fully reactive table.
        </p>
      </docs-prose>

      <docs-code [code]="quickStart" lang="ts" title="people.ts" />

      <docs-prose>
        <h2>Where to go next</h2>
        <ol>
          <li><a routerLink="/installation">Installation</a> covers the package, the optional stylesheet and the peer dependency range.</li>
          <li><a routerLink="/concepts">Core concepts</a> explains the derivation chain and the split between the two entry points.</li>
          <li><a routerLink="/columns">Columns</a> is the fastest way to understand what a column definition can do.</li>
          <li><a routerLink="/api">API reference</a> lists every option, signal and method with its exact signature.</li>
        </ol>
      </docs-prose>
    </docs-page>
  `,
})
export class IntroductionPage {
  protected readonly quickStart = QUICK_START;

  private readonly data = signal(EMPLOYEES);
  private readonly columns = signal(BASIC_COLUMNS);

  protected readonly table = createTable({
    data: this.data,
    columns: this.columns,
    rowId: (row) => row.id,
    initialState: { pagination: { pageIndex: 0, pageSize: 6 } },
  });
}
