export interface NavItem {
  readonly path: string;
  readonly label: string;
}

export interface NavSection {
  readonly title: string;
  readonly items: readonly NavItem[];
}

export const NAV_SECTIONS: readonly NavSection[] = [
  {
    title: 'Getting started',
    items: [
      { path: '/introduction', label: 'Introduction' },
      { path: '/installation', label: 'Installation' },
      { path: '/concepts', label: 'Core concepts' },
    ],
  },
  {
    title: 'Data',
    items: [
      { path: '/columns', label: 'Columns' },
      { path: '/sorting', label: 'Sorting' },
      { path: '/filtering', label: 'Filtering' },
      { path: '/pagination', label: 'Pagination' },
      { path: '/selection', label: 'Selection' },
      { path: '/column-visibility', label: 'Column visibility' },
    ],
  },
  {
    title: 'Rendering',
    items: [
      { path: '/templates', label: 'Templates' },
      { path: '/styling', label: 'Styling' },
      { path: '/headless', label: 'Headless usage' },
    ],
  },
  {
    title: 'Advanced',
    items: [
      { path: '/state', label: 'State and persistence' },
      { path: '/server-side', label: 'Server side data' },
      { path: '/accessibility', label: 'Accessibility' },
    ],
  },
  {
    title: 'Reference',
    items: [{ path: '/api', label: 'API reference' }],
  },
];
