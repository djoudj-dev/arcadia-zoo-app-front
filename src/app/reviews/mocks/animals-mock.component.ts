import { Animal } from '../../core/models/animal.model';

export const ANIMALS: Animal[] = [
  {
    // Ajoute les propriétés des animaux de la jungle
    id: 1,
    name: 'Raihan',
    image: 'images/img_animals/jungle/tigre-raihan.webp',
    species: 'Tigre',
    habitat: `Les forêts tropicales et subtropicales d'Asie du Sud et de l'Est. Raihan vit dans des jungles denses avec des rivières et des cachettes idéales pour chasser.`,
    characteristics: `Solitaire et territorial, Raihan chasse à l'aube ou au crépuscule. Il utilise son camouflage rayé pour surprendre ses proies.`,
    weightRange: '150 à 300 kg selon le sexe et la sous-espèce',
    diet: `Carnivore. Raihan se nourrit de grands herbivores comme les cerfs, sangliers, buffles, ainsi que de plus petites proies comme les singes et les oiseaux.`,
    habitats: ['jungle'],
  },
  {
    id: 2,
    name: 'Ziko',
    image: 'images/img_animals/jungle/singe-ziko.webp',
    species: 'Singe',
    habitat: `Les forêts tropicales denses d’Afrique et d’Amérique du Sud. Ziko vit dans la canopée des arbres, où il se balance à la recherche de nourriture.`,
    characteristics: `Agile et joueur, Ziko est social et vit en groupes. Il communique par des cris et des gestes.`,
    weightRange: '5 à 35 kg selon l’espèce',
    diet: `Omnivore. Ziko mange des fruits, graines, feuilles, insectes, et parfois de petits animaux comme des lézards ou des oiseaux.`,
    habitats: ['jungle'],
  },
  {
    id: 3,
    name: 'Kapi',
    image: 'images/img_animals/jungle/perroquet-kapi.webp',
    species: 'Perroquet',
    habitat: `Les forêts tropicales denses d'Amérique du Sud, notamment en Amazonie. Kapi vit dans des arbres fruitiers avec des abris naturels.`,
    characteristics: `Vif et intelligent, Kapi imite les sons. Ses plumes colorées et sa curiosité le poussent à explorer son environnement.`,
    weightRange: '0,3 à 1,5 kg selon l’espèce',
    diet: `Herbivore. Kapi mange des fruits, graines, noix, baies, et parfois des fleurs et du nectar.`,
    habitats: ['jungle'],
  },
  {
    id: 4,
    name: 'Liana',
    image: 'images/img_animals/jungle/serpent-liana.webp',
    species: 'Serpent',
    habitat: `Les forêts tropicales et les zones humides. Liana vit dans les arbres ou au sol, profitant de la chaleur de la jungle.`,
    characteristics: `Discrète et rapide, Liana grimpe aux arbres et se fond dans la végétation pour capturer ses proies.`,
    weightRange: '1 à 20 kg selon l’espèce',
    diet: `Carnivore. Liana chasse des petits mammifères, oiseaux, lézards, et avale ses proies entières.`,
    habitats: ['jungle'],
  },
  // Ajoute les propriétés des animaux des marais selon Marais.txt
  {
    id: 5,
    name: 'Grom',
    image: 'images/img_animals/marais/crocodile-grom.webp',
    species: 'Crocodile',
    habitat: `Les rivières, les marécages et les zones marécageuses d'Afrique, d'Asie et d'Amérique. Grom passe la majeure partie de sa journée immergé dans les eaux sombres des marais, ne laissant que ses yeux et son museau à la surface.`,
    characteristics: `Grom est un prédateur patient et redoutable, capable de rester immobile pendant des heures avant de fondre sur sa proie. Il chasse principalement des poissons, des oiseaux et des mammifères s'approchant des berges.`,
    weightRange: '500 à 1 000 kg pour les grands spécimens',
    diet: `Carnivore. Grom mange des poissons, oiseaux, amphibiens et parfois de grands mammifères lorsqu'ils s'approchent trop de l'eau. Il est opportuniste et se nourrit également de charognes.`,
    habitats: ['marais'],
  },
  {
    id: 6,
    name: 'Nymbus',
    image: 'images/img_animals/marais/heron-nymbus.webp',
    species: 'Héron',
    habitat: `Les zones humides, marais, et rivières tranquilles. Nymbus est souvent vu debout dans les eaux peu profondes, chassant des poissons et des grenouilles avec son bec pointu.`,
    characteristics: `Calme et élégant, Nymbus peut rester immobile pendant de longues périodes avant de frapper rapidement pour attraper sa proie. Ses longues pattes lui permettent de marcher dans les eaux peu profondes sans difficulté.`,
    weightRange: '1 à 2,5 kg selon l’espèce',
    diet: `Carnivore. Nymbus se nourrit de poissons, grenouilles, insectes aquatiques et petits reptiles qu'il attrape dans l'eau ou à proximité des rives.`,
    habitats: ['marais'],
  },
  {
    id: 7,
    name: 'Flip',
    image: 'images/img_animals/marais/grenouille-flip.webp',
    species: 'Grenouille',
    habitat: `Les marécages, étangs et rivières lentes. Flip vit dans les environnements humides où il peut se nourrir d'insectes et autres petits invertébrés. Les nénuphars et les herbes hautes lui offrent un abri idéal.`,
    characteristics: `Flip est agile, capable de sauter rapidement d'un nénuphar à l'autre. Il chante souvent la nuit, remplissant les marais de ses coassements mélodieux, et son habitat lui permet de rester bien hydraté.`,
    weightRange: '0,1 à 0,5 kg selon l’espèce',
    diet: `Carnivore. Flip mange des insectes, des petits invertébrés comme les vers, les mouches et parfois de petits poissons ou têtards.`,
    habitats: ['marais'],
  },
  {
    id: 8,
    name: 'Sly',
    image: 'images/img_animals/marais/serpent-marais-sly.webp',
    species: "Serpent d'eau",
    habitat: `Les rivières, marécages et autres zones humides. Sly passe la majeure partie de son temps dans l'eau ou à proximité des berges, se déplaçant doucement entre les roseaux et les plantes aquatiques.`,
    characteristics: `Sly est un chasseur aquatique silencieux, attrapant des poissons et de petits amphibies. Il se déplace gracieusement dans l'eau, parfaitement adapté à la vie marécageuse.`,
    weightRange: '1 à 10 kg selon l’espèce',
    diet: `Carnivore. Sly se nourrit principalement de poissons, grenouilles et autres petits animaux aquatiques. Il chasse en nageant dans l'eau, parfois en s'approchant des nids d'oiseaux près des rives.`,
    habitats: ['marais'],
  },
  // Ajoute les propriétés des animaux de la savane selon Savane.txt
  {
    id: 9,
    name: 'Aslan',
    image: 'images/img_animals/savane/lion-aslan.webp',
    species: 'Lion',
    habitat: `Les vastes plaines herbeuses de la savane africaine. Aslan vit dans des environnements ouverts où il peut surveiller les mouvements des troupeaux. Il est souvent vu près des points d'eau, indispensables dans les régions arides de la savane.`,
    characteristics: `Aslan est un leader puissant et vit en groupes appelés «prides». Bien que les lionnes fassent la plupart des chasses, Aslan protège son territoire contre les autres mâles et défend les siens avec bravoure.`,
    weightRange: '150 à 250 kg (les mâles étant plus grands que les femelles)',
    diet: `Carnivore. Aslan se nourrit de grands herbivores comme les zèbres, les gnous, les buffles et parfois des girafes. Il chasse en groupe, souvent avec l'aide des lionnes de la troupe.`,
    habitats: ['savane'],
  },
  {
    id: 10,
    name: 'Tembo',
    image: 'images/img_animals/savane/elephant-tembo.webp',
    species: 'Éléphant',
    habitat: `Les plaines et les savanes africaines. Tembo parcourt de grandes distances à la recherche de nourriture, préférant les zones proches des points d'eau. Les forêts clairsemées et les prairies ouvertes offrent suffisamment de végétation pour qu'il se nourrisse de feuilles, d’écorces et d’herbes.`,
    characteristics: `Tembo est un géant doux et familial. Il vit en troupeaux menés par des matriarches et possède une mémoire impressionnante, capable de se souvenir des points d’eau et des itinéraires migratoires.`,
    weightRange: '4 000 à 6 000 kg',
    diet: `Herbivore. Tembo mange des feuilles, de l'écorce, des fruits, des branches et des herbes. Il peut consommer jusqu'à 150 kg de nourriture par jour.`,
    habitats: ['savane'],
  },
  {
    id: 11,
    name: 'Zuri',
    image: 'images/img_animals/savane/girafe-zuri.webp',
    species: 'Girafe',
    habitat: `Les savanes africaines, où les acacias et autres arbres à feuillage sont abondants. Zuri est souvent vue près de ces arbres, se nourrissant des feuilles grâce à son long cou.`,
    characteristics: `Élégante et tranquille, Zuri utilise son immense taille pour atteindre des feuilles que peu d'autres herbivores peuvent atteindre. Elle est toujours vigilante, surveillant les prédateurs de loin grâce à sa vue perçante.`,
    weightRange: '800 à 1 200 kg',
    diet: `Herbivore. Zuri se nourrit principalement des feuilles d'acacias, mais elle mange aussi d'autres feuillages, fleurs et fruits disponibles dans les arbres.`,
    habitats: ['savane'],
  },
  {
    id: 12,
    name: 'Dash',
    image: 'images/img_animals/savane/guepard-dash.webp',
    species: 'Guépard',
    habitat: `Les plaines ouvertes et herbeuses de la savane. Dash préfère les zones dégagées où il peut utiliser sa vitesse incroyable pour chasser des antilopes et autres proies rapides.`,
    characteristics: `Dash est le mammifère terrestre le plus rapide au monde, atteignant des vitesses stupéfiantes. Contrairement aux lions, il chasse en solitaire, comptant sur la rapidité plutôt que sur la force.`,
    weightRange: '40 à 65 kg',
    diet: `Carnivore. Dash chasse principalement des petites antilopes comme les gazelles, ainsi que des lièvres et parfois de jeunes gnous ou zèbres. Il utilise sa vitesse pour attraper ses proies en les poursuivant.`,
    habitats: ['savane'],
  },
];