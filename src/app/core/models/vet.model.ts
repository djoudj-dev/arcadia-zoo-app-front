export interface Vet {
  id: number;
  name: string; // Nom du vétérinaire
  specialization: string; // Spécialisation (ex : 'Herbivores', 'Félins')
  animalsSpecializedIn: number[]; // Liste des ID d'animaux dans lesquels il est spécialisé
}
