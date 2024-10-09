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
    ],
  },
];
