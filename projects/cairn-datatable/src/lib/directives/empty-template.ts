import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: '[cairnEmpty]',
  standalone: true,
})
export class CairnEmpty {
  readonly templateRef = inject(TemplateRef<void>);
}
