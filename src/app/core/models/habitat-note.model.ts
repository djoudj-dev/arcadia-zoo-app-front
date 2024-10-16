export interface HabitatNote {
  id: number;
  habitatId: number; // ID de l'habitat concerné
  message: string; // Message de l'avis
  vetId: number; // ID du vétérinaire ayant laissé la note
  createdAt: string; // Date de création de l'avis
  updatedAt?: string; // Date de mise à jour
}
