import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CairnDatatable } from 'cairn-datatable';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CairnDatatable],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('cairn-demo');
}
