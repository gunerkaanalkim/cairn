import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'docs-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="flex flex-col gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
      <span>{{ label() }}</span>
      <input
        type="search"
        [value]="value()"
        [placeholder]="placeholder()"
        class="focus-ring w-full rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        (input)="valueChange.emit($any($event.target).value)"
      />
    </label>
  `,
})
export class TextInput {
  readonly label = input.required<string>();
  readonly placeholder = input<string>('');
  readonly value = input<string>('');
  readonly valueChange = output<string>();
}
