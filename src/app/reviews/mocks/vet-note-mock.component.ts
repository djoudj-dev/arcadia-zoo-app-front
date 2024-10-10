import { VetNote } from '../../core/models/vetnote.model';

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
    animalId: 5, // Grom le Crocodile
    vetId: 103,
    animalState: 'En bonne santé',
    food: 'Poisson frais',
    foodWeight: 8, // en kg
    visitDate: new Date('2024-10-04'),
    additionalDetails: "Toujours à l'affût de proies près de la rive.",
  },
  {
    id: 5,
    animalId: 9, // Aslan le Lion
    vetId: 104,
    animalState: 'En forme',
    food: 'Zèbre',
    foodWeight: 10, // en kg
    visitDate: new Date('2024-10-05'),
    additionalDetails: 'Aslan a bien mangé et reste vigilant.',
  },
];
