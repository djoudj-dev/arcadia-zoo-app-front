import { Role } from '../models/role.model';
import { User } from '../models/user.model';

const roles: Role[] = [
  { id: 1, name: 'admin' },
  { id: 2, name: 'vet' },
  { id: 3, name: 'user' },
];

export const users: User[] = [
  {
    id: 1,
    username: 'admin@example.com',
    password: 'admin123',
    role: roles[0],
  },
  { id: 2, username: 'vet@example.com', password: 'vet123', role: roles[1] },
  { id: 3, username: 'user@example.com', password: 'user123', role: roles[2] },
];
