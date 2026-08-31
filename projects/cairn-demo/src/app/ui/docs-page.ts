import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'docs-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="mx-auto max-w-4xl px-6 py-10 lg:px-10">
      <header class="mb-8">
        @if (eyebrow()) {
          <p class="m-0 text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            {{ eyebrow() }}
          </p>
        }
        <h1 class="mt-2 mb-0 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {{ heading() }}
        </h1>
        @if (lead()) {
          <p class="mt-3 mb-0 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{{ lead() }}</p>
        }
      </header>
      <ng-content />
    </article>
  `,
})
export class DocsPage {
  readonly heading = input.required<string>();
  readonly lead = input<string>('');
  readonly eyebrow = input<string>('');
}
