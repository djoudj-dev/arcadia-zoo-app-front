export interface VetNote {
  id: number;
  animalId: number; // ID de l'animal
  vetId: number; // ID du vétérinaire
  animalState: string; // État de l'animal (ex : 'En bonne santé')
  food: string; // Nourriture donnée
  foodWeight: number; // Quantité de nourriture donnée (en kg)
  visitDate: Date; // Date de la visite vétérinaire
  additionalDetails: string; // Détails supplémentaires (facultatif)
  showDetails?: boolean; // Si les détails sont visibles ou non
  createdAt?: string; // Date de création de la note
  updatedAt?: string; // Date de mise à jour de la note
}
