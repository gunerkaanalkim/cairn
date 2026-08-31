import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'introduction',
    title: 'Introduction — Cairn DataTable',
    loadComponent: () => import('./pages/introduction').then((m) => m.IntroductionPage),
  },
  {
    path: 'installation',
    title: 'Installation — Cairn DataTable',
    loadComponent: () => import('./pages/installation').then((m) => m.InstallationPage),
  },
  {
    path: 'concepts',
    title: 'Core concepts — Cairn DataTable',
    loadComponent: () => import('./pages/concepts').then((m) => m.ConceptsPage),
  },
  {
    path: 'columns',
    title: 'Columns — Cairn DataTable',
    loadComponent: () => import('./pages/columns').then((m) => m.ColumnsPage),
  },
  {
    path: 'sorting',
    title: 'Sorting — Cairn DataTable',
    loadComponent: () => import('./pages/sorting').then((m) => m.SortingPage),
  },
  {
    path: 'filtering',
    title: 'Filtering — Cairn DataTable',
    loadComponent: () => import('./pages/filtering').then((m) => m.FilteringPage),
  },
  {
    path: 'pagination',
    title: 'Pagination — Cairn DataTable',
    loadComponent: () => import('./pages/pagination').then((m) => m.PaginationPage),
  },
  {
    path: 'selection',
    title: 'Selection — Cairn DataTable',
    loadComponent: () => import('./pages/selection').then((m) => m.SelectionPage),
  },
  {
    path: 'column-visibility',
    title: 'Column visibility — Cairn DataTable',
    loadComponent: () => import('./pages/column-visibility').then((m) => m.ColumnVisibilityPage),
  },
  {
    path: 'templates',
    title: 'Templates — Cairn DataTable',
    loadComponent: () => import('./pages/templates').then((m) => m.TemplatesPage),
  },
  {
    path: 'styling',
    title: 'Styling — Cairn DataTable',
    loadComponent: () => import('./pages/styling').then((m) => m.StylingPage),
  },
  {
    path: 'headless',
    title: 'Headless usage — Cairn DataTable',
    loadComponent: () => import('./pages/headless').then((m) => m.HeadlessPage),
  },
  {
    path: 'state',
    title: 'State and persistence — Cairn DataTable',
    loadComponent: () => import('./pages/state').then((m) => m.StatePage),
  },
  {
    path: 'server-side',
    title: 'Server side data — Cairn DataTable',
    loadComponent: () => import('./pages/server-side').then((m) => m.ServerSidePage),
  },
  {
    path: 'accessibility',
    title: 'Accessibility — Cairn DataTable',
    loadComponent: () => import('./pages/accessibility').then((m) => m.AccessibilityPage),
  },
  {
    path: 'api',
    title: 'API reference — Cairn DataTable',
    loadComponent: () => import('./pages/api-reference').then((m) => m.ApiReferencePage),
  },
  { path: '', redirectTo: 'introduction', pathMatch: 'full' },
  { path: '**', redirectTo: 'introduction' },
];
