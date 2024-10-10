import { ANIMALS } from './animals-mock.component';

export const HABITATS = [
  {
    id: 1,
    name: 'Savane',
    description:
      "La savane est une formation végétale composée d'herbes et d'arbres espacés. Elle est caractéristique des régions tropicales et équatoriales.",
    image: 'images/img_home/savane.webp',
    animals: [
      ANIMALS.find((animal) => animal.id === 9),
      ANIMALS.find((animal) => animal.id === 10),
      ANIMALS.find((animal) => animal.id === 11),
      ANIMALS.find((animal) => animal.id === 12),
    ].filter((animal) => animal !== undefined),
  },
  {
    id: 2,
    name: 'Jungle',
    description:
      'La jungle est une formation végétale dense et impénétrable, caractéristique des régions tropicales.',
    image: 'images/img_home/jungle.webp',
    animals: [
      ANIMALS.find((animal) => animal.id === 1),
      ANIMALS.find((animal) => animal.id === 2),
      ANIMALS.find((animal) => animal.id === 3),
      ANIMALS.find((animal) => animal.id === 4),
    ].filter((animal) => animal !== undefined),
  },
  {
    id: 3,
    name: 'Marais',
    description:
      'Le marais est une zone humide où l’eau est stagnante ou peu profonde, et où la végétation est abondante.',
    image: 'images/img_home/marais.webp',
    animals: [
      ANIMALS.find((animal) => animal.id === 5),
      ANIMALS.find((animal) => animal.id === 6),
      ANIMALS.find((animal) => animal.id === 7),
      ANIMALS.find((animal) => animal.id === 8),
    ].filter((animal) => animal !== undefined),
  },
];
