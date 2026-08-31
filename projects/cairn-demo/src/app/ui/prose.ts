import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Shared typography wrapper for the narrative parts of a documentation page.
 */
@Component({
  selector: 'docs-prose',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="text-[15px] leading-relaxed text-zinc-700 [&_a]:font-medium [&_a]:text-indigo-600 [&_a]:underline [&_code]:rounded [&_code]:bg-zinc-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] [&_code]:text-zinc-900 [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-zinc-900 [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-zinc-900 [&_li]:my-1 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-4 [&_strong]:font-semibold [&_strong]:text-zinc-900 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 dark:text-zinc-300 dark:[&_a]:text-indigo-400 dark:[&_code]:bg-zinc-800 dark:[&_code]:text-zinc-100 dark:[&_h2]:text-zinc-100 dark:[&_h3]:text-zinc-100 dark:[&_strong]:text-zinc-100"
    >
      <ng-content />
    </div>
  `,
})
export class Prose {}
