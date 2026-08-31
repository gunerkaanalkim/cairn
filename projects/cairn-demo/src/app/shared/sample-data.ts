import type { ColumnDef } from '@gunerkaanalkim/cairn-datatable/core';

export interface Employee {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly role: string;
  readonly department: string;
  readonly status: 'active' | 'invited' | 'suspended';
  readonly projects: number;
  readonly joinedAt: string;
}

const FIRST_NAMES = [
  'Ada', 'Bruno', 'Clara', 'Diego', 'Elif', 'Farah', 'Gunnar', 'Hana',
  'Ivan', 'Julia', 'Kemal', 'Lena', 'Mateo', 'Nadia', 'Omar', 'Petra',
  'Quinn', 'Rosa', 'Sami', 'Tessa', 'Ugo', 'Vera', 'Wouter', 'Yara',
];

const LAST_NAMES = [
  'Adler', 'Bertrand', 'Costa', 'Duarte', 'Eriksen', 'Fontaine', 'Grimaldi', 'Halvorsen',
  'Ionescu', 'Jansen', 'Kowalski', 'Lindqvist', 'Moreau', 'Novak', 'Okafor', 'Petrov',
];

const ROLES = ['Owner', 'Admin', 'Editor', 'Viewer'];
const DEPARTMENTS = ['Engineering', 'Design', 'Finance', 'Operations', 'Support'];
const STATUSES: Employee['status'][] = ['active', 'invited', 'suspended'];

export const EMPLOYEES: readonly Employee[] = Array.from({ length: 84 }, (_, index) => {
  const first = FIRST_NAMES[index % FIRST_NAMES.length];
  const last = LAST_NAMES[(index * 7) % LAST_NAMES.length];
  const month = String((index % 12) + 1).padStart(2, '0');
  const day = String((index % 27) + 1).padStart(2, '0');

  return {
    id: index + 1,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@cairn.dev`,
    role: ROLES[index % ROLES.length],
    department: DEPARTMENTS[index % DEPARTMENTS.length],
    status: STATUSES[index % STATUSES.length],
    projects: (index * 13) % 24,
    joinedAt: `20${20 + (index % 5)}-${month}-${day}`,
  };
});

/** Minimal column set used by the introductory examples. */
export const BASIC_COLUMNS: readonly ColumnDef<Employee>[] = [
  { id: 'name', header: 'Name' },
  { id: 'email', header: 'Email' },
  { id: 'role', header: 'Role' },
  { id: 'department', header: 'Department' },
];

/** Wider column set used by the feature pages. */
export const FULL_COLUMNS: readonly ColumnDef<Employee>[] = [
  { id: 'id', header: 'ID', align: 'end' },
  { id: 'name', header: 'Name' },
  { id: 'email', header: 'Email' },
  { id: 'role', header: 'Role' },
  { id: 'department', header: 'Department' },
  { id: 'status', header: 'Status' },
  { id: 'projects', header: 'Projects', align: 'end' },
  { id: 'joinedAt', header: 'Joined' },
];
