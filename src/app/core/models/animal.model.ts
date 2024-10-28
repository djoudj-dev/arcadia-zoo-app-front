import { VetNote } from '../models/vetnote.model';
import { Diet } from './diet.enum';

export interface Animal {
  id: number; // Identifiant de l'animal
  name: string; // Nom de l'animal
  image: string; // URL de l'image de l'animal
  species: string; // Espèce de l'animal
  habitat: string; // Description de l'habitat
  characteristics: string | string[]; // Caractéristiques principales de l'animal
  weightRange: string; // Fourchette de poids (ex : '150 à 300 kg')
  diet: Diet; // Régime alimentaire (utilise l'enum Diet)
  habitats: string[]; // Liste des habitats où l'animal peut être trouvé
  habitatId: number; // ID de l'habitat auquel l'animal est associé
  vetNote?: VetNote; // Note vétérinaire optionnelle
}
