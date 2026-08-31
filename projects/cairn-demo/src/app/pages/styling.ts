import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTable, type CairnClassNames } from '@gunerkaanalkim/cairn-datatable';
import { createTable } from '@gunerkaanalkim/cairn-datatable/core';
import { BASIC_COLUMNS, EMPLOYEES } from '../shared/sample-data';
import { ApiList, type ApiEntry } from '../ui/api-list';
import { CodeBlock } from '../ui/code-block';
import { DemoBlock } from '../ui/demo-block';
import { DemoPager } from '../ui/demo-pager';
import { DocsPage } from '../ui/docs-page';
import { Prose } from '../ui/prose';

type PresetId = 'default' | 'tailwind' | 'editorial';

const TAILWIND_CLASSES: CairnClassNames = {
  table: 'w-full border-collapse text-sm',
  thead: 'bg-zinc-50 dark:bg-zinc-900',
  headerCell: 'px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500',
  headerCellSorted: 'text-indigo-600 dark:text-indigo-400',
  cell: 'px-4 py-2.5 text-zinc-700 dark:text-zinc-300',
  rowEven: 'bg-white dark:bg-zinc-950',
  rowOdd: 'bg-zinc-50/60 dark:bg-zinc-900/40',
  rowSelected: 'bg-indigo-50 dark:bg-indigo-500/10',
  selectionCell: 'px-4',
  selectionHeaderCell: 'px-4',
  emptyCell: 'px-4 py-8 text-center text-zinc-500',
};

const PRESETS: readonly { id: PresetId; label: string; note: string }[] = [
  { id: 'default', label: 'Shipped stylesheet', note: 'The optional CSS file, nothing else.' },
  { id: 'tailwind', label: 'classNames input', note: 'Utility classes passed per element.' },
  { id: 'editorial', label: 'Plain CSS', note: 'Global rules targeting the data-* attributes.' },
];

@Component({
  selector: 'app-styling',
  imports: [DataTable, RouterLink, ApiList, CodeBlock, DemoBlock, DemoPager, DocsPage, Prose],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page
      eyebrow="Rendering"
      heading="Styling"
      lead="Three independent ways to dress the same markup: the shipped stylesheet, a class name per element, or plain CSS against the published data attributes."
    >
      <docs-demo
        heading="The same table, three styling strategies"
        description="Switch between the presets. The component, the data and the state are identical in all three."
        [ts]="presetTs"
      >
        <div class="mb-4 flex flex-wrap gap-2">
          @for (preset of presets; track preset.id) {
            <button
              type="button"
              class="focus-ring rounded-md border px-3 py-1.5 text-sm transition"
              [class]="
                preset.id === active()
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300'
                  : 'border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800'
              "
              (click)="active.set(preset.id)"
            >
              {{ preset.label }}
            </button>
          }
        </div>

        <p class="mb-4 text-sm text-zinc-500 dark:text-zinc-400">{{ activeNote() }}</p>

        <div class="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <cairn-data-table
            [table]="table"
            [selectable]="true"
            [classNames]="activeClasses()"
            caption="Styling demo"
          />
        </div>
        <docs-pager [table]="table" [showSelection]="true" />
      </docs-demo>

      <docs-prose>
        <h2>1. The shipped stylesheet</h2>
        <p>
          A single optional import. Every rule lives inside the <code>&#64;layer cairn</code> cascade
          layer, so any unlayered rule of yours wins regardless of specificity. It also defines five
          custom properties you can re-map without touching a selector.
        </p>
      </docs-prose>
      <docs-code [code]="tokens" lang="css" title="Re-mapping the tokens" />

      <docs-prose>
        <p>
          The stylesheet switches to a dark palette through
          <code>prefers-color-scheme</code>. If your application drives dark mode from a class on the
          root element instead, re-declare the five properties under that class, exactly as this
          documentation site does.
        </p>
        <p>
          Skipping the import is a supported mode. You get a bare, entirely unstyled
          <code>&lt;table&gt;</code>, which is the right starting point when your design system already
          styles table elements.
        </p>

        <h2>2. The classNames input</h2>
        <p>
          Nineteen keys, one per element the component renders. Values are appended to the built in
          class, never replace it, so the <code>data-*</code> hooks and the default rules keep
          working alongside your utilities.
        </p>
      </docs-prose>

      <docs-api heading="classNames keys" [entries]="keys" />

      <docs-code [code]="classNamesTs" lang="ts" title="A Tailwind preset" />

      <docs-prose>
        <h2>3. Plain CSS against the data attributes</h2>
        <p>
          Every relevant element publishes its state as an attribute, so a stylesheet can do the whole
          job without a single class being passed in.
        </p>
        <ol>
          <li><code>data-column-id</code> on every header cell and body cell.</li>
          <li><code>data-sorted</code> on the header cell, with the values <code>none</code>, <code>ascending</code> and <code>descending</code>, mirroring <code>aria-sort</code>.</li>
          <li><code>data-selected</code> on the row, <code>true</code> or <code>false</code>.</li>
          <li><code>data-align</code> on the header cell and body cell, from the column definition.</li>
        </ol>
      </docs-prose>

      <docs-code [code]="dataCss" lang="css" title="Styling by attribute" />

      <docs-prose>
        <p>
          Because <code>cairn-data-table</code> is a component with emulated encapsulation, these
          rules have to live in a global stylesheet rather than in the parent component's
          <code>styles</code>. Scope them with <code>classNames.root</code>, which lands on the host
          element, if you need more than one look in the same application.
        </p>

        <h2>Built in class names</h2>
        <p>
          Each element also carries a stable class you can target directly:
          <code>cairn-root</code>, <code>cairn-table</code>, <code>cairn-thead</code>,
          <code>cairn-header-row</code>, <code>cairn-header-cell</code>,
          <code>cairn-header-cell-sorted</code>, <code>cairn-header-button</code>,
          <code>cairn-sort-icon</code>, <code>cairn-tbody</code>, <code>cairn-row</code>,
          <code>cairn-row-selected</code>, <code>cairn-row-even</code>, <code>cairn-row-odd</code>,
          <code>cairn-cell</code>, <code>cairn-selection-header-cell</code>,
          <code>cairn-selection-cell</code>, <code>cairn-empty-row</code>,
          <code>cairn-empty-cell</code>, <code>cairn-loading-row</code> and
          <code>cairn-loading-cell</code>.
        </p>
        <p>
          For content rather than appearance, see <a routerLink="/templates">Templates</a>.
        </p>
      </docs-prose>
    </docs-page>
  `,
})
export class StylingPage {
  protected readonly presets = PRESETS;
  protected readonly active = signal<PresetId>('default');

  protected readonly activeClasses = computed<CairnClassNames>(() => {
    switch (this.active()) {
      case 'tailwind':
        return TAILWIND_CLASSES;
      case 'editorial':
        return { root: 'demo-editorial' };
      default:
        return {};
    }
  });

  protected readonly activeNote = computed(
    () => PRESETS.find((preset) => preset.id === this.active())?.note ?? ''
  );

  private readonly data = signal(EMPLOYEES.slice(0, 20));
  private readonly columns = signal(BASIC_COLUMNS);

  protected readonly table = createTable({
    data: this.data,
    columns: this.columns,
    rowId: (row) => row.id,
    initialState: { pagination: { pageIndex: 0, pageSize: 6 } },
  });

  protected readonly presetTs = `
import type { CairnClassNames } from '@gunerkaanalkim/cairn-datatable';

const tailwind: CairnClassNames = {
  table: 'w-full border-collapse text-sm',
  thead: 'bg-zinc-50',
  headerCell: 'px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500',
  headerCellSorted: 'text-indigo-600',
  cell: 'px-4 py-2.5 text-zinc-700',
  rowOdd: 'bg-zinc-50/60',
  rowSelected: 'bg-indigo-50',
};

// Plain CSS preset: only a scope class, the rest lives in a stylesheet.
const editorial: CairnClassNames = { root: 'demo-editorial' };
`;

  protected readonly tokens = `
/* The five custom properties declared on .cairn-table */
.cairn-table {
  --cairn-border: #e4e4e7;
  --cairn-header-bg: #fafafa;
  --cairn-row-hover: #f4f4f5;
  --cairn-text: #18181b;
  --cairn-bg: #ffffff;
}

/* Class driven dark mode instead of prefers-color-scheme */
html.dark .cairn-table {
  --cairn-border: #27272a;
  --cairn-header-bg: #18181b;
  --cairn-row-hover: #27272a;
  --cairn-text: #fafafa;
  --cairn-bg: #09090b;
}
`;

  protected readonly dataCss = `
/* Highlight the sorted column, header and body cells alike. */
.cairn-table [data-sorted='ascending'],
.cairn-table [data-sorted='descending'] {
  color: #4f46e5;
}

/* Selected rows. */
.cairn-table tr[data-selected='true'] {
  background: #eef2ff;
}

/* One specific column. */
.cairn-table [data-column-id='email'] {
  font-family: ui-monospace, monospace;
}

/* Alignment comes from the column definition. */
.cairn-table [data-align='end'] {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
`;

  protected readonly classNamesTs = `
<cairn-data-table
  [table]="table"
  [selectable]="true"
  [classNames]="{
    table: 'min-w-full divide-y divide-gray-200',
    headerCell: 'px-6 py-3 bg-gray-50 text-xs font-medium uppercase text-gray-500',
    cell: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500'
  }"
/>
`;

  protected readonly keys: readonly ApiEntry[] = [
    { name: 'root', type: 'string', description: 'The host cairn-data-table element. The right place for a scope class.' },
    { name: 'table', type: 'string', description: 'The table element.' },
    { name: 'thead', type: 'string', description: 'The thead element.' },
    { name: 'headerRow', type: 'string', description: 'The tr inside thead.' },
    { name: 'headerCell', type: 'string', description: 'Every th rendered for a column.' },
    { name: 'headerCellSorted', type: 'string', description: 'Added to the th while that column is sorted.' },
    { name: 'sortIcon', type: 'string', description: 'The span holding the ascending or descending arrow.' },
    { name: 'tbody', type: 'string', description: 'The tbody element.' },
    { name: 'row', type: 'string', description: 'Every tr in the body.' },
    { name: 'rowSelected', type: 'string', description: 'Added to a tr while the row is selected.' },
    { name: 'rowEven', type: 'string', description: 'Rows at an even index on the current page.' },
    { name: 'rowOdd', type: 'string', description: 'Rows at an odd index on the current page.' },
    { name: 'cell', type: 'string', description: 'Every td rendered for a column.' },
    { name: 'selectionHeaderCell', type: 'string', description: 'The th holding the select all checkbox.' },
    { name: 'selectionCell', type: 'string', description: 'The td holding a row checkbox.' },
    { name: 'emptyRow', type: 'string', description: 'The tr rendered when the page is empty.' },
    { name: 'emptyCell', type: 'string', description: 'The spanning td rendered when the page is empty.' },
    { name: 'loadingRow', type: 'string', description: 'The tr rendered while loading.' },
    { name: 'loadingCell', type: 'string', description: 'The spanning td rendered while loading.' },
  ];
}
