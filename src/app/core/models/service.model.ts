import { Feature } from './feature.model';

export interface Service {
  id: number;
  name: string; // Nom du service (ex : 'Restauration', 'Visite guidée')
  description: string; // Description du service
  image: string; // URL de l'image du service
  location: string; // Emplacement du service dans le zoo
  hours: string; // Horaires d'ouverture (ex : '9h-18h')
  features: Feature[]; // Caractéristiques (ex : ['Accès handicapé', 'Wi-Fi gratuit'])
  showFullDescription?: boolean; // Indique si la description complète doit être affichée
}
