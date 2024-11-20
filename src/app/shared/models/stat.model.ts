export interface Stat {
  animalId: number; // ID de l'animal concerné
  animalName: string; // Nom de l'animal
  consultations: number; // Nombre de consultations de la fiche de cet animal
  lastConsultationDate?: string; // Date de la dernière consultation (facultatif)
}
