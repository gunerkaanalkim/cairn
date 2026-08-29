import { ColumnDef } from '@gunerkaanalkim/cairn-datatable/core';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const COLUMNS: ColumnDef<User>[] = [
  { id: 'id', header: 'ID' },
  { id: 'name', header: 'Name' },
  { id: 'email', header: 'Email' },
  { id: 'role', header: 'Role' },
];

export const DATA: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? 'Admin' : 'User'
}));
