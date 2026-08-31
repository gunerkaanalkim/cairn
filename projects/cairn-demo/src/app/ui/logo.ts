import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * The Cairn mark: four stacked stones that narrow towards the top, which read
 * the other way as four rows of a table. It inherits `currentColor`, so the
 * surrounding text colour drives it in both themes.
 *
 * Size it from the host element, for example `<cairn-logo class="h-8 w-8" />`.
 */
@Component({
  selector: 'cairn-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <svg viewBox="0 0 32 32" fill="none" class="h-full w-full" aria-hidden="true">
      <rect x="11" y="3" width="10" height="5" rx="2.5" fill="currentColor" />
      <rect x="7.2" y="10" width="16" height="5" rx="2.5" fill="currentColor" />
      <rect x="6.3" y="17" width="21" height="5" rx="2.5" fill="currentColor" />
      <rect x="3" y="24" width="26" height="5" rx="2.5" fill="currentColor" />
    </svg>
  `,
})
export class CairnLogo {}
