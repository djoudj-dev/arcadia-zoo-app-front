import { VetNote } from '../../../../../core/models/vetnote.model';

export enum Diet {
  Herbivore = 'Herbivore',
  Carnivore = 'Carnivore',
  Omnivore = 'Omnivore',
}

export interface Animal {
  id_animal: number; // Identifiant de l'animal
  name: string; // Nom de l'animal
  images: string | null; // URL de l'image de l'animal (optionnel)
  species: string; // Espèce de l'animal
  habitat_id: number; // ID de l'habitat auquel l'animal est associé
  characteristics: string; // Caractéristiques principales de l'animal (tableau de chaînes)
  weightRange: string; // Fourchette de poids (ex : '150 à 300 kg')
  diet: Diet; // Régime alimentaire (utilise l'enum Diet)
  habitats?: string[]; // Liste des habitats où l'animal peut être trouvé (optionnel)
  vetNote?: VetNote; // Note vétérinaire optionnelle
  showTime?: boolean; // Afficher les caractéristiques de l'animal
  created_at: Date; // Date de création
  updated_at: Date; // Date de mise à jour
}
