import { Animal } from '../../animal-management/model/animal.model';

export interface Habitat {
  id_habitat: number;
  name: string;
  description: string;
  images: string | null;
  created_at?: Date;
  updated_at?: Date;
  animals: Animal[];
  showDescription?: boolean;
  showDeleteConfirmation?: boolean;
}
