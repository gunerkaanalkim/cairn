import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiList, type ApiEntry } from '../ui/api-list';
import { CodeBlock } from '../ui/code-block';
import { DocsPage } from '../ui/docs-page';
import { Prose } from '../ui/prose';

const STAGES = [
  { name: 'data()', note: 'The rows you own. Any signal or plain getter.' },
  { name: 'baseRows', note: 'Rows wrapped with a stable id and a source index.' },
  { name: 'filteredRows', note: 'Global filter and column filters applied.' },
  { name: 'sortedRows', note: 'Multi column sort applied, stable by source index.' },
  { name: 'rows', note: 'Current page, with the selection flag merged in.' },
];

@Component({
  selector: 'app-concepts',
  imports: [RouterLink, ApiList, CodeBlock, DocsPage, Prose],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page
      eyebrow="Getting started"
      heading="Core concepts"
      lead="Four ideas explain the whole library: two entry points, a derivation chain, stable row identity, and state you fully own."
    >
      <docs-prose>
        <h2>Two entry points</h2>
        <p>
          <code>@gunerkaanalkim/cairn-datatable/core</code> contains no component and no template. It
          exports <code>createTable</code>, the type definitions and a handful of default constants.
          It depends on Angular signals and nothing else, so it never touches the DOM.
        </p>
        <p>
          <code>@gunerkaanalkim/cairn-datatable</code> re-exports everything from the core entry point
          and adds <code>DataTable</code>, the four template directives and the
          <code>CairnClassNames</code> interface. Use it when you want a rendered table; import only
          the core entry point when you render the rows yourself.
        </p>
      </docs-prose>
      <docs-code [code]="imports" lang="ts" title="Import paths" />

      <docs-prose>
        <h2>The derivation chain</h2>
        <p>
          <code>createTable</code> builds one <code>computed</code> per stage. Each stage depends only
          on the stage before it and on the state signals it needs, so changing the page index
          recomputes pagination alone and leaves the sorted result untouched.
        </p>
      </docs-prose>

      <ol class="my-6 list-none space-y-2 p-0">
        @for (stage of stages; track stage.name; let last = $last) {
          <li class="flex items-start gap-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <code class="shrink-0 font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              {{ stage.name }}
            </code>
            <span class="text-sm text-zinc-600 dark:text-zinc-400">{{ stage.note }}</span>
          </li>
        }
      </ol>

      <docs-prose>
        <p>
          <code>sortedRows</code> is exposed on purpose. It is the full result set after filtering and
          sorting but before pagination, which is what an export or a select all across pages needs.
        </p>

        <h2>Row identity</h2>
        <p>
          Every row is wrapped in a <code>Row&lt;T&gt;</code> object carrying an <code>id</code>, the
          original <code>data</code> reference, the <code>sourceIndex</code> in the input array and a
          <code>selected</code> flag. The original object is never cloned and never mutated.
        </p>
        <p>
          <strong>The default <code>rowId</code> is the array index.</strong> That is fine for a static
          list, but as soon as the data can be re-sorted, paged from a server or reordered, pass a real
          identity. Selection is keyed by this value, so an index based id silently selects the wrong
          rows after the array changes.
        </p>
      </docs-prose>
      <docs-code [code]="rowId" lang="ts" title="Stable identity" />

      <docs-prose>
        <h2>You own the state</h2>
        <p>
          The table keeps six pieces of state: sorting, global filter, column filters, pagination,
          selection and hidden columns. Each one is readable as a signal, writable through a method,
          and readable as a whole through <code>state()</code>. Nothing is stored anywhere else, so
          restoring a saved view is a single <code>setState</code> call. See
          <a routerLink="/state">State and persistence</a>.
        </p>
      </docs-prose>

      <docs-api heading="createTable options at a glance" [entries]="options" />

      <docs-prose>
        <p>
          <a routerLink="/api">The API reference</a> documents each option in full, including the
          <code>manual</code> flags used for <a routerLink="/server-side">server side data</a>.
        </p>
      </docs-prose>
    </docs-page>
  `,
})
export class ConceptsPage {
  protected readonly stages = STAGES;

  protected readonly imports = `
// Logic only. No component, no template, no DOM.
import { createTable, type TableApi } from '@gunerkaanalkim/cairn-datatable/core';

// Component layer. Re-exports everything above.
import { DataTable, CairnCell, type CairnClassNames } from '@gunerkaanalkim/cairn-datatable';
`;

  protected readonly rowId = `
const table = createTable({
  data: this.data,
  columns: this.columns,

  // Without this the row id is the array index, which breaks
  // selection as soon as the underlying array is replaced.
  rowId: (row) => row.id,
});
`;

  protected readonly options: readonly ApiEntry[] = [
    {
      name: 'data',
      type: '() => readonly T[]',
      description:
        'Reactive source of rows. Any zero argument function works, a signal is the natural choice.',
    },
    {
      name: 'columns',
      type: '() => readonly ColumnDef<T>[]',
      description: 'Reactive source of column definitions. Changing it re-derives the whole chain.',
    },
    {
      name: 'rowId',
      type: '(row: T, index: number) => string | number',
      defaultValue: '(row, index) => index',
      description:
        'Produces the stable identity used by selection and by the track expression of the rendered rows.',
    },
    {
      name: 'initialState',
      type: 'Partial<TableState>',
      defaultValue: '{}',
      description:
        'Seeds sorting, filters, pagination, selection and hidden columns on the first render. Missing keys fall back to the library defaults.',
    },
    {
      name: 'multiSort',
      type: 'boolean',
      defaultValue: 'true',
      description:
        'Allows more than one active sort column. When false, an additive toggle replaces the current sort instead of appending to it.',
    },
    {
      name: 'sortFn',
      type: '(a: unknown, b: unknown) => number',
      defaultValue: 'numbers compared numerically, everything else with localeCompare',
      description: 'Fallback comparator used for every column that does not define its own sortFn.',
    },
    {
      name: 'filterFn',
      type: '(value: unknown, query: string) => boolean',
      defaultValue: 'case insensitive substring match',
      description: 'Fallback predicate used for every column that does not define its own filterFn.',
    },
    {
      name: 'manual',
      type: '{ sorting?: boolean; filtering?: boolean; pagination?: boolean }',
      defaultValue: '{}',
      description:
        'Switches off individual pipeline stages so a server can own them. The matching state is still tracked, it is simply not applied to the rows.',
    },
  ];
}
