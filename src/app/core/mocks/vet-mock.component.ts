import { Vet } from '../models/vet.model';

export const MOCK_VETS: Vet[] = [
  // Spécialistes pour les animaux de la jungle
  {
    id: 1,
    name: 'Dr. Sarah Martins',
    specialization: 'Spécialiste des grands carnivores (Tigres)',
    animalsSpecializedIn: [1], // Raihan le Tigre
  },
  {
    id: 2,
    name: 'Dr. John Doe',
    specialization: 'Spécialiste des primates',
    animalsSpecializedIn: [2], // Ziko le Singe
  },
  {
    id: 3,
    name: 'Dr. Emily Turner',
    specialization: 'Spécialiste des oiseaux exotiques',
    animalsSpecializedIn: [3], // Kapi le Perroquet
  },
  {
    id: 4,
    name: 'Dr. Liam Collins',
    specialization: 'Spécialiste des reptiles (Serpents)',
    animalsSpecializedIn: [4], // Liana le Serpent
  },

  // Spécialistes pour les animaux des marais
  {
    id: 5,
    name: 'Dr. Noah Peterson',
    specialization: 'Spécialiste des reptiles et amphibiens',
    animalsSpecializedIn: [5, 7, 8], // Grom le Crocodile, Flip la Grenouille, Sly le Serpent d'eau
  },
  {
    id: 6,
    name: 'Dr. Olivia Harper',
    specialization: 'Spécialiste des oiseaux aquatiques',
    animalsSpecializedIn: [6], // Nymbus le Héron
  },

  // Spécialistes pour les animaux de la savane
  {
    id: 7,
    name: 'Dr. Alexander Moore',
    specialization: 'Spécialiste des grands félins (Lions, Guépards)',
    animalsSpecializedIn: [9, 12], // Aslan le Lion, Dash le Guépard
  },
  {
    id: 8,
    name: 'Dr. Maya Wilson',
    specialization: 'Spécialiste des grands mammifères (Éléphants, Girafes)',
    animalsSpecializedIn: [10, 11], // Tembo l'Éléphant, Zuri la Girafe
  },
];
