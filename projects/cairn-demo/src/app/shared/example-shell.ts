import { Component, input } from '@angular/core';

@Component({
  selector: 'app-example-shell',
  standalone: true,
  template: `
    <div style="margin-bottom: 2rem; border: 1px solid #ccc; padding: 1rem;">
      <h2>{{ title() }}</h2>
      <div style="margin-top: 1rem;">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class ExampleShell {
  readonly title = input.required<string>();
}
