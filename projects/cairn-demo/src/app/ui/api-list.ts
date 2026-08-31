import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface ApiEntry {
  readonly name: string;
  readonly type: string;
  readonly defaultValue?: string;
  readonly description: string;
}

@Component({
  selector: 'docs-api',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="my-6">
      @if (heading()) {
        <h3 class="mb-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">{{ heading() }}</h3>
      }
      <dl class="divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        @for (entry of entries(); track entry.name) {
          <div class="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,18rem)_1fr] sm:gap-6">
            <dt class="min-w-0">
              <code class="font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400">{{ entry.name }}</code>
              <div class="mt-1 break-words font-mono text-xs text-zinc-500 dark:text-zinc-400">{{ entry.type }}</div>
              @if (entry.defaultValue) {
                <div class="mt-1 font-mono text-xs text-zinc-400 dark:text-zinc-500">
                  default: {{ entry.defaultValue }}
                </div>
              }
            </dt>
            <dd class="m-0 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{{ entry.description }}</dd>
          </div>
        }
      </dl>
    </div>
  `,
})
export class ApiList {
  readonly entries = input.required<readonly ApiEntry[]>();
  readonly heading = input<string>('');
}
