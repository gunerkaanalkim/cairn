import { Routes } from '@angular/router';
import { BasicExample } from './examples/basic/basic-example';
import { StyledExample } from './examples/styled/styled-example';
import { TailwindExample } from './examples/tailwind/tailwind-example';
import { HeadlessExample } from './examples/headless/headless-example';

export const routes: Routes = [
  { path: 'basic', component: BasicExample },
  { path: 'styled', component: StyledExample },
  { path: 'tailwind', component: TailwindExample },
  { path: 'headless', component: HeadlessExample },
  { path: '', redirectTo: 'basic', pathMatch: 'full' }
];
