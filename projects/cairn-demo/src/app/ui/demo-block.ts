import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { CodeBlock } from './code-block';

type TabId = 'preview' | 'ts' | 'html';

@Component({
  selector: 'docs-demo',
  imports: [CodeBlock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="my-8 overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <header class="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
        <h3 class="m-0 text-base font-semibold text-zinc-900 dark:text-zinc-100">{{ heading() }}</h3>
        @if (description()) {
          <p class="mt-1 mb-0 text-sm text-zinc-600 dark:text-zinc-400">{{ description() }}</p>
        }
      </header>

      <div
        role="tablist"
        class="flex gap-1 border-b border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/60"
      >
        @for (tab of tabs(); track tab.id) {
          <button
            type="button"
            role="tab"
            [attr.aria-selected]="active() === tab.id"
            class="focus-ring rounded-md px-3 py-1.5 text-xs font-medium transition"
            [class]="
              active() === tab.id
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
            "
            (click)="active.set(tab.id)"
          >
            {{ tab.label }}
          </button>
        }
      </div>

      <div class="p-5">
        <div [hidden]="active() !== 'preview'">
          <ng-content />
        </div>
        @if (active() === 'ts') {
          <docs-code [code]="ts()" lang="ts" title="TypeScript" />
        }
        @if (active() === 'html') {
          <docs-code [code]="html()" lang="html" title="Template" />
        }
      </div>
    </section>
  `,
})
export class DemoBlock {
  readonly heading = input.required<string>();
  readonly description = input<string>('');
  readonly ts = input<string>('');
  readonly html = input<string>('');

  protected readonly active = signal<TabId>('preview');

  protected readonly tabs = computed(() => {
    const list: { id: TabId; label: string }[] = [{ id: 'preview', label: 'Preview' }];
    if (this.ts()) list.push({ id: 'ts', label: 'TypeScript' });
    if (this.html()) list.push({ id: 'html', label: 'Template' });
    return list;
  });
}
