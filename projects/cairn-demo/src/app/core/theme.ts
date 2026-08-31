import { DOCUMENT, Injectable, computed, inject, signal } from '@angular/core';

const STORAGE_KEY = 'cairn-docs-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly state = signal<'light' | 'dark'>(this.readInitial());

  readonly theme = this.state.asReadonly();
  readonly isDark = computed(() => this.state() === 'dark');

  toggle(): void {
    this.apply(this.state() === 'dark' ? 'light' : 'dark');
  }

  private apply(next: 'light' | 'dark'): void {
    this.state.set(next);
    this.document.documentElement.classList.toggle('dark', next === 'dark');
    try {
      this.document.defaultView?.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage can be blocked, the in memory state is still correct */
    }
  }

  private readInitial(): 'light' | 'dark' {
    return this.document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }
}
