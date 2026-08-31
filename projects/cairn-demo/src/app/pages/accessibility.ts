import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataTable } from '@gunerkaanalkim/cairn-datatable';
import { createTable } from '@gunerkaanalkim/cairn-datatable/core';
import { BASIC_COLUMNS, EMPLOYEES } from '../shared/sample-data';
import { CodeBlock } from '../ui/code-block';
import { DemoBlock } from '../ui/demo-block';
import { DemoPager } from '../ui/demo-pager';
import { DocsPage } from '../ui/docs-page';
import { Prose } from '../ui/prose';

const KEYS = [
  { key: 'Tab', effect: 'Moves focus to the next sortable header button, then out of the table.' },
  { key: 'Enter', effect: 'Cycles the focused column: ascending, descending, unsorted.' },
  { key: 'Space', effect: 'Same as Enter. Scrolling is suppressed while a header has focus.' },
  { key: 'Shift with Enter', effect: 'Adds the focused column to the existing sort instead of replacing it.' },
  { key: 'Escape', effect: 'Clears every sort, not only the focused column.' },
];

@Component({
  selector: 'app-accessibility',
  imports: [DataTable, RouterLink, CodeBlock, DemoBlock, DemoPager, DocsPage, Prose],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-page
      eyebrow="Advanced"
      heading="Accessibility"
      lead="Real buttons, real table semantics, and the ARIA (Accessible Rich Internet Applications) attributes a screen reader expects from a sortable grid."
    >
      <docs-demo
        heading="Try it with the keyboard"
        description="Tab into the header, then use Enter, Shift with Enter, and Escape."
        [html]="markup"
      >
        <div class="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <cairn-data-table
            [table]="table"
            [selectable]="true"
            caption="Team members, sortable by column"
          />
        </div>
        <docs-pager [table]="table" [showSelection]="true" />
      </docs-demo>

      <docs-prose>
        <h2>Keyboard map</h2>
      </docs-prose>

      <dl class="my-6 divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        @for (item of keys; track item.key) {
          <div class="grid gap-1 px-4 py-3 sm:grid-cols-[12rem_1fr] sm:gap-6">
            <dt>
              <kbd class="rounded border border-zinc-300 bg-zinc-50 px-2 py-0.5 font-mono text-xs dark:border-zinc-700 dark:bg-zinc-800">
                {{ item.key }}
              </kbd>
            </dt>
            <dd class="m-0 text-sm text-zinc-700 dark:text-zinc-300">{{ item.effect }}</dd>
          </div>
        }
      </dl>

      <docs-prose>
        <h2>What the component emits</h2>
        <ol>
          <li>Native <code>table</code>, <code>thead</code>, <code>tbody</code>, <code>tr</code>, <code>th</code> and <code>td</code> elements, so assistive technology gets row and column context for free.</li>
          <li><code>scope="col"</code> on every header cell.</li>
          <li><code>aria-sort</code> on every header cell, with <code>none</code>, <code>ascending</code> or <code>descending</code>. A column with <code>sortable: false</code> always reports <code>none</code>.</li>
          <li>A real <code>&lt;button&gt;</code> inside each sortable header, which is what makes the column reachable by Tab and operable by Enter and Space without any custom key handling.</li>
          <li><code>aria-busy="true"</code> on the <code>tbody</code> while the <code>loading</code> input is true.</li>
          <li>Labelled checkboxes: <code>Select all rows on this page</code> for the header, and <code>Select row</code> followed by the row identity for each row.</li>
        </ol>

        <h2>Give the table a caption</h2>
        <p>
          The <code>caption</code> input renders a real <code>&lt;caption&gt;</code> element. It is
          the accessible name of the table and the first thing a screen reader announces, so prefer it
          over a visually adjacent heading.
        </p>
      </docs-prose>

      <docs-code [code]="markup" lang="html" title="Accessible setup" />

      <docs-prose>
        <h2>Two things you have to do yourself</h2>
        <ol>
          <li>
            <strong>Row checkbox labels use the row identity.</strong> With the default
            <code>rowId</code> that is an array index, which reads as <em>Select row 4</em>. Pass a
            <code>rowId</code> that means something, or replace the label by rendering your own
            checkbox column with a <code>cairnCell</code> template.
          </li>
          <li>
            <strong>Pagination controls are yours.</strong> The library renders none, so the buttons
            in your pager need their own accessible names and disabled states. The pager on the
            <a routerLink="/pagination">Pagination</a> page is a working starting point.
          </li>
        </ol>

        <h2>Contrast and focus</h2>
        <p>
          The shipped stylesheet sets colours through five custom properties and does not define a
          focus ring, deferring to the browser default. If you restyle the header button, keep a
          visible <code>:focus-visible</code> outline that meets the WCAG (Web Content Accessibility
          Guidelines) AA contrast minimum.
        </p>
      </docs-prose>
    </docs-page>
  `,
})
export class AccessibilityPage {
  protected readonly keys = KEYS;

  protected readonly markup = `
<cairn-data-table
  [table]="table"
  [selectable]="true"
  caption="Team members, sortable by column"
  [loading]="loading()"
  emptyMessage="No members match this search."
/>
`;

  private readonly data = signal(EMPLOYEES.slice(0, 12));
  private readonly columns = signal(BASIC_COLUMNS);

  protected readonly table = createTable({
    data: this.data,
    columns: this.columns,
    rowId: (row) => row.id,
    initialState: { pagination: { pageIndex: 0, pageSize: 6 } },
  });

}
