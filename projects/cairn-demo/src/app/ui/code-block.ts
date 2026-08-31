import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { highlight, type CodeLang } from '../core/highlight';

@Component({
  selector: 'docs-code',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="group relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div
        class="flex items-center justify-between border-b border-zinc-200 px-4 py-2 dark:border-zinc-800"
      >
        <span class="font-mono text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {{ label() }}
        </span>
        <button
          type="button"
          class="focus-ring rounded-md px-2 py-1 text-xs font-medium text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          (click)="copy()"
        >
          {{ copied() ? 'Copied' : 'Copy' }}
        </button>
      </div>
      <pre
        class="overflow-x-auto p-4 text-[13px] leading-relaxed"
      ><code class="font-mono" [innerHTML]="rendered()"></code></pre>
    </div>
  `,
})
export class CodeBlock {
  readonly code = input.required<string>();
  readonly lang = input<CodeLang>('ts');
  readonly title = input<string>('');

  protected readonly copied = signal(false);
  protected readonly rendered = computed(() => highlight(this.code().trim(), this.lang()));
  protected readonly label = computed(() => this.title() || this.lang());

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code().trim());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    } catch {
      /* clipboard access can be denied, the code stays selectable by hand */
    }
  }
}
