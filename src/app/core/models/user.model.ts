import { Role } from './role.model';

export interface User {
  id: number;
  username: string;
  password: string;
  role: Role[];
}
