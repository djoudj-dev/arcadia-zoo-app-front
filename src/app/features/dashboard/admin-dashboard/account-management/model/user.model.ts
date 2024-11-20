import { Role } from './role.model';

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role?: Role;
  role_id?: number;
  token?: string;
}
