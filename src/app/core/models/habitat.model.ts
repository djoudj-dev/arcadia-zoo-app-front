import { Animal } from './animal.model';

export interface Habitat {
  id: number;
  name: string;
  description: string;
  image: string;
  animals: Animal[];
}
