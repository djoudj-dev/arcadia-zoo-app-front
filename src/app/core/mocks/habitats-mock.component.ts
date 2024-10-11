import { ANIMALS } from './animals-mock.component';

export const HABITATS = [
  {
    id: 1,
    name: 'Savane',
    description:
      "La savane est une vaste plaine ouverte, parsemée d'herbes hautes et d'arbres disséminés. Elle abrite une incroyable diversité d'animaux adaptés aux conditions chaudes et sèches des régions tropicales, comme les lions, les éléphants, et les antilopes. Venez découvrir ces majestueuses créatures dans leur habitat naturel.",
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
      "La jungle est une forêt dense et luxuriante, offrant un refuge à une multitude d'espèces exotiques. Laissez-vous envoûter par l'ambiance mystérieuse et les sons fascinants des animaux cachés dans cet écosystème unique. Explorez cet environnement riche et vibrant où la vie règne en maître.",
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
      "Le marais est un habitat mystérieux et fascinant, où l'eau et la terre se mélangent pour créer une zone humide grouillante de vie. Des espèces uniques comme les reptiles et les amphibiens prospèrent dans ces conditions humides. Découvrez un écosystème délicat et essentiel pour l'équilibre naturel.",
    image: 'images/img_home/marais.webp',
    animals: [
      ANIMALS.find((animal) => animal.id === 5),
      ANIMALS.find((animal) => animal.id === 6),
      ANIMALS.find((animal) => animal.id === 7),
      ANIMALS.find((animal) => animal.id === 8),
    ].filter((animal) => animal !== undefined),
  },
];
