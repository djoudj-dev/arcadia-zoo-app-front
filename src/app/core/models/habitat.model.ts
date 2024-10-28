import { Animal } from './animal.model';

export interface Habitat {
  id: number;
  name: string; // Nom de l'habitat
  description: string; // Description de l'habitat
  image: string; // URL de l'image de l'habitat
  animals: Animal[]; // Liste des animaux présents dans cet habitat
  showDescription?: boolean; // Afficher la description de l'habitat
}
