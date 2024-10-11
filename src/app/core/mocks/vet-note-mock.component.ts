import { VetNote } from '../models/vetnote.model';

export const MOCK_VET_NOTES: VetNote[] = [
  {
    id: 1,
    animalId: 1, // Raihan le Tigre
    vetId: 101,
    animalState: 'Bonne santé',
    food: 'Viande de bœuf',
    foodWeight: 5, // en kg
    visitDate: new Date('2024-10-01'),
    additionalDetails: 'Examen régulier, rien à signaler.',
  },
  {
    id: 2,
    animalId: 2, // Ziko le Singe
    vetId: 102,
    animalState: 'Actif et en bonne santé',
    food: 'Fruits tropicaux',
    foodWeight: 2, // en kg
    visitDate: new Date('2024-10-02'),
    additionalDetails: 'Légère agitation, aucun autre problème.',
  },
  {
    id: 3,
    animalId: 3, // Kapi le Perroquet
    vetId: 101,
    animalState: 'En forme',
    food: 'Graines et noix',
    foodWeight: 0.5, // en kg
    visitDate: new Date('2024-10-03'),
    additionalDetails: 'Plumage vibrant et comportement curieux.',
  },
  {
    id: 4,
    animalId: 4, // Liana le Serpent
    vetId: 101,
    animalState: 'Bonne forme physique',
    food: 'Rongeurs',
    foodWeight: 0.4, // en kg
    visitDate: new Date('2024-10-04'),
    additionalDetails: 'Mue récente, comportement normal.',
  },
  {
    id: 5,
    animalId: 5, // Grom le Crocodile
    vetId: 103,
    animalState: 'En bonne santé',
    food: 'Poisson frais',
    foodWeight: 8, // en kg
    visitDate: new Date('2024-10-04'),
    additionalDetails: "Toujours à l'affût de proies près de la rive.",
  },
  {
    id: 6,
    animalId: 6, // Nymbus le Héron
    vetId: 103,
    animalState: 'Bonne santé',
    food: 'Poissons et grenouilles',
    foodWeight: 1.2, // en kg
    visitDate: new Date('2024-10-05'),
    additionalDetails: 'Comportement calme, chasse normalement.',
  },
  {
    id: 7,
    animalId: 7, // Flip la Grenouille
    vetId: 103,
    animalState: 'Très actif',
    food: 'Insectes',
    foodWeight: 0.05, // en kg
    visitDate: new Date('2024-10-05'),
    additionalDetails: 'Chante souvent la nuit, comportement normal.',
  },
  {
    id: 8,
    animalId: 8, // Sly le Serpent d'eau
    vetId: 104,
    animalState: 'En bonne santé',
    food: 'Poissons et petits animaux aquatiques',
    foodWeight: 0.6, // en kg
    visitDate: new Date('2024-10-06'),
    additionalDetails: 'Très discret, chasse dans les eaux peu profondes.',
  },
  {
    id: 9,
    animalId: 9, // Aslan le Lion
    vetId: 104,
    animalState: 'En forme',
    food: 'Zèbre',
    foodWeight: 10, // en kg
    visitDate: new Date('2024-10-05'),
    additionalDetails: 'Aslan a bien mangé et reste vigilant.',
  },
  {
    id: 10,
    animalId: 10, // Tembo l'Éléphant
    vetId: 105,
    animalState: 'Bonne santé',
    food: 'Herbes, feuilles, écorce',
    foodWeight: 120, // en kg
    visitDate: new Date('2024-10-07'),
    additionalDetails: 'Tembo a récemment rejoint un nouveau groupe familial.',
  },
  {
    id: 11,
    animalId: 11, // Zuri la Girafe
    vetId: 105,
    animalState: 'En très bonne forme',
    food: 'Feuilles d’acacia',
    foodWeight: 40, // en kg
    visitDate: new Date('2024-10-07'),
    additionalDetails: 'Très alerte, Zuri surveille toujours les alentours.',
  },
  {
    id: 12,
    animalId: 12, // Dash le Guépard
    vetId: 106,
    animalState: 'Rapide et en bonne santé',
    food: 'Antilopes et gazelles',
    foodWeight: 5, // en kg
    visitDate: new Date('2024-10-08'),
    additionalDetails: 'A récemment couru à grande vitesse pour chasser.',
  },
];
