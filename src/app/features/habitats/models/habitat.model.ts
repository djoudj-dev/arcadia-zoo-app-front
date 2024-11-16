import { Animal } from 'app/features/dashboard/admin-dashboard/animal-management/model/animal.model';

export interface Habitat {
  id_habitat: number;
  name: string;
  description: string;
  images?: string;
  created_at?: Date;
  updated_at?: Date;
  animals: Animal[];
}
