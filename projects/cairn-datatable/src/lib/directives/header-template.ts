import { Directive, TemplateRef, inject, input } from '@angular/core';
import type { ColumnDef } from '@gunerkaanalkim/cairn-datatable/core';

@Directive({
  selector: '[cairnHeader]',
  standalone: true,
})
export class CairnHeader<T> {
  readonly cairnHeader = input<string | undefined>(undefined);
  readonly templateRef = inject<TemplateRef<{ $implicit: ColumnDef<T> }>>(TemplateRef);

  static ngTemplateContextGuard<T>(
    _dir: CairnHeader<T>,
    _ctx: unknown,
  ): _ctx is { $implicit: ColumnDef<T> } {
    return true;
  }
}
