import { VetNote } from './vetnote.model';

export interface Animal {
  id: number;
  name: string;
  species: string; // Espèce de l'animal
  habitat: string; // Nom de l'habitat
  characteristics: string; // Caractéristiques principales de l'animal
  weightRange: string; // Fourchette de poids (par exemple, '50-100kg')
  diet: string; // Régime alimentaire (par exemple, 'Herbivore')
  image: string; // URL de l'image de l'animal
  habitats: string[]; // Liste des habitats où l'animal pourrait être trouvé
  habitatId: number; // ID de l'habitat auquel l'animal est associé
  vetNote?: VetNote; // Note vétérinaire optionnelle
}
