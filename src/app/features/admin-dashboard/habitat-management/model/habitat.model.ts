import { Animal } from '../../animal-management/model/animal.model';

export interface Habitat {
  id_habitat: number; // Aligner avec le modèle backend
  name: string; // Nom de l'habitat
  description: string; // Description de l'habitat
  images: string; // URL de l'image de l'habitat (aligné avec le backend)
  animals: Animal[]; // Liste des animaux présents dans cet habitat
  showDescription?: boolean; // Afficher la description de l'habitat
  created_at: Date; // Date de création
  updated_at: Date; // Date de mise à jour
}
