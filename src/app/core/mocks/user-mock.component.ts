import { User } from '../models/user.model';
import { ROLES } from './role-mock.component';

export const USERS: User[] = [
  {
    id: 1,
    username: 'admin@example.com',
    password: 'admin123',
    role: [ROLES[0]], // Assignez un tableau de rôles
  },
  {
    id: 2,
    username: 'vet@example.com',
    password: 'vet123',
    role: [ROLES[1]], // Assignez un tableau de rôles
  },
  {
    id: 3,
    username: 'employe@example.com',
    password: 'employe123',
    role: [ROLES[2]], // Assignez un tableau de rôles
  },
];
