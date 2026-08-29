import { Directive, TemplateRef, inject, input } from '@angular/core';

export interface CellContext<T> {
  readonly $implicit: unknown;
  readonly row: T;
  readonly columnId: string;
}

@Directive({
  selector: '[cairnCell]',
  standalone: true,
})
export class CairnCell<T> {
  readonly cairnCell = input<string | undefined>(undefined);
  readonly templateRef = inject<TemplateRef<CellContext<T>>>(TemplateRef);

  static ngTemplateContextGuard<T>(
    _dir: CairnCell<T>,
    _ctx: unknown,
  ): _ctx is CellContext<T> {
    return true;
  }
}
