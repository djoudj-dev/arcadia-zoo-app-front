// animal.model.ts
import { VetNote } from '../models/vetnote.model';
import { Diet } from './diet.enum';

export interface Animal {
  id: number; // Identifiant de l'animal
  name: string; // Nom de l'animal
  image: string | null; // URL de l'image de l'animal (optionnel)
  species: string; // Espèce de l'animal
  habitatId: number; // ID de l'habitat auquel l'animal est associé
  characteristics: string; // Caractéristiques principales de l'animal (tableau de chaînes)
  weightRange: string; // Fourchette de poids (ex : '150 à 300 kg')
  diet: Diet; // Régime alimentaire (utilise l'enum Diet)
  habitats?: string[]; // Liste des habitats où l'animal peut être trouvé (optionnel)
  vetNote?: VetNote; // Note vétérinaire optionnelle
  showCharacteristics?: boolean; // Afficher les caractéristiques de l'animal
}
