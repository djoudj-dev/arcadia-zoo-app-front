import { Animal } from '../models/animal.model';
import { VetNote } from '../models/vetnote.model';
import { MOCK_VET_NOTES } from './vet-note-mock.component';
import { Diet } from '../models/diet.enum'; // Importer l'enum

export const ANIMALS: Animal[] = [
  {
    id: 1,
    name: 'Raihan',
    image: 'images/img_animals/jungle/tigre-raihan.webp',
    species: 'Tigre',
    //habitat: `Les forêts tropicales et subtropicales d'Asie du Sud et de l'Est. Raihan vit dans des jungles denses avec des rivières et des cachettes idéales pour chasser.`,
    characteristics: `Solitaire et territorial, Raihan chasse à l'aube ou au crépuscule. Il utilise son camouflage rayé pour surprendre ses proies.`,
    weightRange: '150 à 300 kg selon le sexe et la sous-espèce',
    diet: Diet.Carnivore, // Utilisation de l'enum
    habitats: ['jungle'],
    habitatId: 2,
    vetNote: MOCK_VET_NOTES.find((note: VetNote) => note.animalId === 1),
  },
  {
    id: 2,
    name: 'Ziko',
    image: 'images/img_animals/jungle/singe-ziko.webp',
    species: 'Singe',
    //habitat: `Les forêts tropicales denses d’Afrique et d’Amérique du Sud. Ziko vit dans la canopée des arbres, où il se balance à la recherche de nourriture.`,
    characteristics: `Agile et joueur, Ziko est social et vit en groupes. Il communique par des cris et des gestes.`,
    weightRange: '5 à 35 kg selon l’espèce',
    diet: Diet.Omnivore, // Utilisation de l'enum
    habitats: ['jungle'],
    habitatId: 2,
    vetNote: MOCK_VET_NOTES.find((note: VetNote) => note.animalId === 2),
  },
  {
    id: 3,
    name: 'Kapi',
    image: 'images/img_animals/jungle/perroquet-kapi.webp',
    species: 'Perroquet',
    //habitat: `Les forêts tropicales denses d'Amérique du Sud, notamment en Amazonie. Kapi vit dans des arbres fruitiers avec des abris naturels.`,
    characteristics: `Vif et intelligent, Kapi imite les sons. Ses plumes colorées et sa curiosité le poussent à explorer son environnement.`,
    weightRange: '0,3 à 1,5 kg selon l’espèce',
    diet: Diet.Herbivore, // Utilisation de l'enum
    habitats: ['jungle'],
    habitatId: 2,
    vetNote: MOCK_VET_NOTES.find((note: VetNote) => note.animalId === 3),
  },
  // Ajoutez d'autres animaux comme précédemment...
];
