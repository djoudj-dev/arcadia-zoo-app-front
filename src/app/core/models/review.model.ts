export interface Review {
  id: number;
  name: string; // Nom du visiteur ayant laissé l'avis
  date: string; // Date à laquelle l'avis a été posté
  message: string; // Message de l'avis
  rating: number; // Note attribuée par le visiteur (ex : 4.5)
  accepted: boolean; // Si l'avis a été accepté ou non par l'employé
  validated: boolean; // Si l'avis a été validé par l'administrateur
  publishedAt?: string; // Date de publication de l'avis (facultatif)
}
