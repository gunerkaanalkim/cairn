import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: '[cairnLoading]',
  standalone: true,
})
export class CairnLoading {
  readonly templateRef = inject(TemplateRef<void>);
}
