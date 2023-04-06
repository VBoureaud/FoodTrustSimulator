
export type ProfilesGameType = {
  [x: string]: {
    pocketSize: number;
    typeCount: number;
    typeRandom: boolean;
    questCount: number;
    image: string;
    sell: {
      farmer: number;
      manager: number;
      cook: number;
    }
    description: {
      en: string;
      fr: string;
    };
    questLimit: number;
  };
};

// Coherence with server needed here
export const profilesGame: ProfilesGameType = {
  'farmer': {
    pocketSize: 7,
    typeCount: 5,//nb of token you can create
    typeRandom: true,// random token
    questCount: 5, //nb of token you need for a quest
    sell: { // xp bonus for (%) ?
      farmer: 0,
      manager: 50,
      cook: 50,
    },
    image: '0-2-5-5-2-1-1-1-3-0',
    description: {
      'en': 'This profile illustrate the labor of working on the farm, in an educational and fun context. The tokens you will create are ingredients that will be useful to other players. You will be able to create 5 different ingredients for each level.',
      'fr': 'Vous pouvez créer des ingrédients qui sont utiles pour le marchant ou le cuisinier. A chaque nouveau niveau votre liste d\'ingrédients constructibles évolue.',
    },
    questLimit: 24,// hours after you can validate a new quest
  },
  'manager': {
    pocketSize: 14,
    typeCount: 2,
    typeRandom: false,
    questCount: 5,
    sell: {
      farmer: 50,
      manager: 0,
      cook: 50,
    },
    image: '0-4-5-5-5-0-0-2-2-0',
    description: {
      'en': 'This profile illustrates the role of marketplace manager, with inventory management and community needs. Your objective will be to find the best way to deploy strategy to obtain more influence.',
      'fr': 'Avec une capacité de stockage supérieure, vous essayez de devenir une référence pour les agriculteurs ou les cuisiniers dans le besoin.',
    },
    questLimit: 24,// hours after you can validate a new quest
  },
  'cook': {
    pocketSize: 10,
    typeCount: 6,
    typeRandom: false,
    questCount: 5,
    sell: {
      farmer: 0,
      manager: 50,
      cook: 0,
    },
    image: '0-5-4-5-6-2-2-0-4-0',
    description: {
      'en': 'This profile illustrates the profession of cook, using items got from other players to prepare them for consumption. Able to heat, freeze and mix his collection, in order to modify certain properties of the tokens.',
      'fr': 'Vous pouvez cuisiner ou créer de nouvelles recettes à vendre aux marchants ou aux agriculteurs. Vous aurez besoin de vous approvisionner chez eux.',
    },
    questLimit: 24,// hours after you can validate a new quest
  },
};

// should be the same on server
export const actionPoints = {
  'acceptedOffer': 500,
  'buyOfferToSmallLevel': 700,
  'mintToken': 100,
  'questCompleted': 900,
}

// should be the same on server
export const limitGame = {
  'pocket': 50,
  'smallProfile': 2000,
  'maxLevel': 100,
  'durabilityDefault': 5,
  'durabilityWhenCold': 8,
  'durabilityWhenHeat': 2,
  'durabilityTokenFusionned': 5,
  'powerDefault': 1,
  'powerWhenParents': 3,
  'powerWhenHeatWParents': 6,
  'powerWhenHeat': 2,
  'powerWhenCold': 1,
  'recipeCreatedByDay': 1,
  'adCreatedByDay': 5,
  'adCreatedForUser': 1,
  'maxDayBurnout': 1,
}

type TypeToken = {
  name: string;
  profile: string;
  percent?: number;
  desc?: string;
}
type NameTypeToken = {
  [x: string]: TypeToken;
};

// same on server
// if add cook/manager, need update typeCount
export const nameTypeToken: NameTypeToken = {
  '000001': { 
    'profile': 'farmer',
    'name': 'eggplant',
    'desc': 'A plant (Solanum melongena) native to India and usually ovoid fruits that are chiefly purple.'
  },
  '000002': { 
    'profile': 'farmer',
    'name': 'banana',
    'desc': 'A fruit or a berrie ( Musa balbisiana or Musa acuminata), native from papua new guinea, very nutritious, low in calories and good source of potassium.'
  },
  '000003': { 
    'profile': 'farmer',
    'name': 'broccoli',
    'desc': 'Native from Sicile, it was selected by the romans from wild cabbage. It is composed of 92% of water, low energy but at least have a lots of minerals. It is a neutral aliment and used by chinese traditional medecine.'
  },
  '000004': { 
    'profile': 'farmer',
    'name': 'carrot',
    'desc': 'It represents the principal root vegetable grown around the world, rich in beta carotene and high content of vitamin c.'
  },
  '000005': { 
    'profile': 'farmer',
    'name': 'cherry',
    'desc': 'Fruit and plant native from Caucase. There are more than 600 varieties of it.'
  },
  '000006': { 
    'profile': 'farmer',
    'name': 'mushroom',
    'desc': 'Member of the eukaryotic family, was already eaten 13,000 years ago. Can be comestible or toxic and reproduce via spores.'
  },
  '000007': { 
    'profile': 'farmer',
    'name': 'cheese',
    'desc': 'Produced in a wide range of flavors, textures and shapes by coagulation of milk.',
  },
  '000008': { 
    'profile': 'farmer',
    'name': 'lemon',
    'desc': 'Native from Mediterranean and comes from a hybrid between bigarade and citron. Its flesh is juicy, and rich in vitamin C.'
  },
  '000009': { 
    'profile': 'farmer',
    'name': 'pumpkin',
    'desc': 'Native from North America, Its peduncle is hard and fibrous, with five distinctly angular ribs. It is used for Halloween much more often than the pumpkin.'
  },
  '000010': { 
    'profile': 'farmer',
    'name': 'cucumber',
    'desc': 'From the plant Cucumis sativus, native to India and after being grown in the Himalayas, it is now found all over the world. This vegetable contains 95% of water.'
  },
  '000011': { 
    'profile': 'farmer',
    'name': 'zucchini',
    'desc': 'Vegetable from the family of the curcubitacea. Contains Vitamine A, B6, B9, C and have a high potassium.',
  },
  '000012': { 
    'profile': 'farmer',
    'name': 'shrimp',
    'desc': 'Crustacean that lives beyond the sea, rich in omega 3 and proteins. They can have a role in the fight against cardiovascular problems.'
  },
  '000013': { 
    'profile': 'farmer',
    'name': 'croissant',
    'desc': 'Native from France, knowed as a pastry. Some butter, water, flour, yeast, sugar, salt et voilà.',
  },
  '000014': { 
    'profile': 'farmer',
    'name': 'corn',
    'desc': 'Vegetable from the plant Zea Mays native from the Mexico, their grains are rich in starch.',
  },
  '000015': { 
    'profile': 'farmer',
    'name': 'mango',
    'desc': 'Stone fruit produced by the tropical tree Mangifera indica. It can be used as sauce, ice cream, smoothies, milk or juice.',
  },
  '000016': { 
    'profile': 'farmer',
    'name': 'melon',
    'desc': 'Sweet, edible and fleshy Cucurbitaceae. You can smell it when it\'s ready to eat.',
  },
  '000017': { 
    'profile': 'farmer',
    'name': 'honey',
    'desc': 'Sweet and viscous substance made by several bees. Bees produce honey by gathering and then refining the sugary secretions of plants.',
  },
  '000018': { 
    'profile': 'farmer',
    'name': 'eggs',
    'desc': 'Bird eggs are a common food and one of the most versatile ingredients used in cooking.',
  },
  '000019': { 
    'profile': 'farmer',
    'name': 'potato',
    'desc': 'Root vegetable, known to be a starchy of the Solanum tuberosum plant and native to the Americas. Rich source of vitamin B6 and vitamin C.',
  },
  '000020': { 
    'profile': 'farmer',
    'name': 'chilli_pepper',
    'desc': 'Cultivated for its spiciness, it is a variety of berries of plants of the genus Capsicum.'
  },
  '000021': { 
    'profile': 'farmer',
    'name': 'leek',
    'desc': 'Crunchy and firm vegetable, the edible part of the plant is a bundle of leaf sheaths which is sometimes mistakenly called a stalk.'
  },
  '000022': { 
    'profile': 'farmer',
    'name': 'pear',
    'desc': 'A fruit cultivated in China as early as 2000 BC. Raw pear is 84% water, 15% carbohydrates and contains negligible protein.',
  },
  '000023': { 
    'profile': 'farmer',
    'name': 'turnip',
    'desc': 'Root vegetable commonly grown in temperate climates worldwide for its white, fleshy taproot. Rich source of vitamin K, vitamin A and vitamin C.',
  },
  '000024': { 
    'profile': 'farmer',
    'name': 'lettuce',
    'desc': 'An annual plant of the family Asteraceae. It is most often grown as a leaf vegetable, but sometimes for its stem and seeds.'
  },
  '000025': { 
    'profile': 'farmer',
    'name': 'tomato',
    'desc': 'Considered as a vegetable, it is a fruit classified by botany as a berry offering a significant source of umami flavor.'
  },
  '000026': { 
    'profile': 'farmer',
    'name': 'meat',
    'desc': 'Animal flesh that is eaten as food. Mainly composed of water, protein, and fat, it is edible raw but is normally eaten after it has been cooked.',
  },
  '000027': { 
    'profile': 'farmer',
    'name': 'rutabaga',
    'desc': 'A root vegetable with significant amounts of vitamin C. Considered to have originated in Scandinavia, Finland or Russia.',
  },
  '000028': { 
    'profile': 'farmer',
    'name': 'pasta',
    'desc': 'Made from an unleavened dough of wheat flour mixed with water or eggs.'
  },
  '001000': { 
    'profile': 'cook',
    'name': 'recipe',
    'desc': 'A list of ingredients to follow to prepare something.'
  },
  '001001': { 
    'profile': 'cook',
    'name': 'gloubiboulga',
    'desc': 'Favorite food of a dinosaur, and a successful recipe.',
    'percent': 100
  },
  '001002': { 
    'profile': 'cook',
    'name': 'colored_cubes',
    'desc': 'A good recipe, with almost all the ingredients.',
    'percent': 80
  },
  '001003': { 
    'profile': 'cook',
    'name': 'soup',
    'desc': 'Combined ingredients, result of a half-follow recipe',
    'percent': 50
  },
  '001004': { 
    'profile': 'cook',
    'name': 'strange_mix',
    'desc': 'It seems that the cook followed is own way for this recipe.',
    'percent': 30
  },
  '001005': { 
    'profile': 'cook',
    'name': 'failed_recipe',
    'desc': 'The ingredients are mixed but no recipe matches.',
    'percent': 0
  },
  '002000': { 
    'profile': 'manager',
    'name': 'coin',
    'desc': 'The new cryptocurrency that will change the world or just a simple token?',
  },
  '002001': { 
    'profile': 'manager',
    'name': 'box',
    'desc': 'A box to store everything. Check the Family Tree to see what\'s inside.'
  },
};

export const levelToXp = (level: number) => {
  return (5*level**3)/4;
}
export const levelDisplay = (xp: number) => {
  // (5*9**3)/4 > get xp when lvl 9
  // Math.cbrt((4*4218.75) / 5) > get lvl

  // use to be
  // return parseInt((coef * Math.log(xp)) + '');
  // now is
  return parseInt(Math.cbrt((4*xp) / 5) + '');
};

export const calculNextLevel = (xp: number) => {
  const current = levelDisplay(xp);
  while (current == levelDisplay(++xp));
  return xp;
}

export const calculPrevLevel = (xp: number) => {
  const current = levelDisplay(xp);
  while (current == levelDisplay(--xp));
  return xp;
}

export const doProgress = (experience: number) => {
    if (!experience) return 0;
    const next = calculNextLevel(experience);
    const prev = calculPrevLevel(experience);
    const total = (100 * (experience - prev)) / (next - prev);
    return total;
  }


type Badge = {
  [x: string]: {
    collection: number;
    transaction: number;
    pocket: number;
    minted: number;
    burned: number;
    quests: number;
    firstScore: number;
    beginnerHelp: number;
    burnout: number;
    level: number;
  };
};

type BadgeDesc = {
  [x: string]: string;
}
export const badgeDesc: BadgeDesc = {
  '1': '10 transactions',
  '2': '1 Quest winned',
  '3': 'Beginner\'s help',
  '4': '30 transactions',
  '5': 'Level 100',
  '6': 'Short circuit',
  '7': 'Burn out',
  '8': 'First Token',
  '9': 'Pocket size updated',
  '10': '20 transactions',
  '11': '30 tokens minted',
  '12': '10 tokens minted',
  '13': 'Highest Level',
  '14': '10 tokens burned',
  '15': '100 Quests winned',
}

export const badgeCondition: Badge = {
  '1': {
    collection: 0,
    transaction: 10,
    pocket: 0,
    minted: 0,
    burned: 0,
    quests: 0,
    firstScore: 0,
    beginnerHelp: 0,
    burnout: 0,
    level: 0,
  },
  '2': {
    collection: 0,
    transaction: 0,
    pocket: 0,
    minted: 0,
    burned: 0,
    quests: 1,
    firstScore: 0,
    beginnerHelp: 0,
    burnout: 0,
    level: 0,
  },
  '3': {
    collection: 0,
    transaction: 0,
    pocket: 0,
    minted: 0,
    burned: 0,
    quests: 0,
    firstScore: 0,
    beginnerHelp: 1,
    burnout: 0,
    level: 0,
  },
  '4': {
    collection: 0,
    transaction: 30,
    pocket: 0,
    minted: 0,
    burned: 0,
    quests: 0,
    firstScore: 0,
    beginnerHelp: 0,
    burnout: 0,
    level: 0,
  },
  '5': {
    collection: 0,
    transaction: 0,
    pocket: 0,
    minted: 0,
    burned: 0,
    quests: 0,
    firstScore: 0,
    beginnerHelp: 0,
    burnout: 0,
    level: 100,
  },
  '6': {
    collection: 0,
    transaction: 0,
    pocket: 0,
    minted: 0,
    burned: 0,
    quests: 0,
    firstScore: 0,
    beginnerHelp: 5,
    burnout: 0,
    level: 0,
  },
  '7': {
    collection: 0,
    transaction: 0,
    pocket: 0,
    minted: 0,
    burned: 0,
    quests: 0,
    firstScore: 0,
    beginnerHelp: 0,
    burnout: 1,
    level: 0,
  },
  '8': {
    collection: 0,
    transaction: 0,
    pocket: 0,
    minted: 1,
    burned: 0,
    quests: 0,
    firstScore: 0,
    beginnerHelp: 0,
    burnout: 0,
    level: 0,
  },
  '9': {
    collection: 0,
    transaction: 0,
    pocket: 1,
    minted: 0,
    burned: 0,
    quests: 0,
    firstScore: 0,
    beginnerHelp: 0,
    burnout: 0,
    level: 0,
  },
  '10': {
    collection: 0,
    transaction: 20,
    pocket: 0,
    minted: 0,
    burned: 0,
    quests: 0,
    firstScore: 0,
    beginnerHelp: 0,
    burnout: 0,
    level: 0,
  },
  '11': {
    collection: 0,
    transaction: 0,
    pocket: 0,
    minted: 30,
    burned: 0,
    quests: 0,
    firstScore: 0,
    beginnerHelp: 0,
    burnout: 0,
    level: 0,
  },
  '12': {
    collection: 0,
    transaction: 0,
    pocket: 0,
    minted: 10,
    burned: 0,
    quests: 0,
    firstScore: 0,
    beginnerHelp: 0,
    burnout: 0,
    level: 0,
  },
  '13': {
    collection: 0,
    transaction: 0,
    pocket: 0,
    minted: 0,
    burned: 0,
    quests: 0,
    firstScore: 1,
    beginnerHelp: 0,
    burnout: 0,
    level: 0,
  },
  '14': {
    collection: 0,
    transaction: 0,
    pocket: 0,
    minted: 0,
    burned: 10,
    quests: 0,
    firstScore: 0,
    beginnerHelp: 0,
    burnout: 0,
    level: 0,
  },
  '15': {
    collection: 0,
    transaction: 0,
    pocket: 0,
    minted: 0,
    burned: 0,
    quests: 100,
    firstScore: 0,
    beginnerHelp: 0,
    burnout: 0,
    level: 0,
  },
}

// Same on Server
// Compare list ingredients in a list of recipes
// with ingredients selected
// params:
//// recipes ex: [ '0004;0005', ... ]
//// ingredients ex: [ '0004;0005' ] 
// ret: higher % of combinaison successfull
// same in server
export const recipeCondition = (recipes:string[], ingredients: string[]) => {
  let currentPourcentage = 0;
  for (let i = 0; i < recipes.length; i++) {
    const needed = recipes[i].split(';').sort();
    if (needed.join(',') === ingredients.join(',')) {
      return 100;
    } else {
      const founded = needed.filter(e => ingredients.indexOf(e) !== -1);
      const resultFounded = founded.length / needed.length;
      currentPourcentage = resultFounded > currentPourcentage ? resultFounded : currentPourcentage;
    }
  }
  return currentPourcentage * 100;
}

// Get Token for the percent - same as server
export const getRecipePercent = (nameTypeToken: NameTypeToken, percent: number) => {
  const recipes = Object.keys(nameTypeToken).filter((e: string) => nameTypeToken[e].profile === 'cook' && nameTypeToken[e].percent !== undefined);
  const recipeDetails = recipes.map((e: string) => ({ ...nameTypeToken[e], id: e }));
  let recipe = recipeDetails.filter((e: TypeToken) => e.percent === 0)[0];
  for (let i = 0; i < recipeDetails.length; i++) {
    if (percent >= recipeDetails[i].percent)
      recipe = recipe && recipe.percent < recipeDetails[i].percent ? recipeDetails[i] : recipe;
  }
  return recipe;
}

// get type#specs
// ex: "00012#c:15;g:53;h:23;se:23"
// ret: "contrast(15%) grayscale(53) ..."
export const translateImageSpecsToCss = (image: string) => {
  const options:{[key:string]: {
    scale: string;
    code: string;
  }} = {
    'contrast': { scale: '%', code: 'c' },
    'grayscale': { scale: '%', code: 'g' },
    'hue-rotate': { scale: 'deg', code: 'h' },
    'invert': { scale: '%', code: 'i' },
    'saturate': { scale: '', code: 's' },
    'sepia': { scale: '%', code: 'se' },
  };
  const enumGenerated: {[key: string]: string} = Object.keys(options).reduce((accum: {[key: string]: string}, elt:string) => {
    accum[options[elt].code] = elt;
    return accum;
  }, {});
  if (image.split('#').length == 1)
    return '';
  const specs = image.split('#')[1].split(';');
  if (!specs.length)
    return '';
  let translated = '';
  for (let i = 0; i < specs.length; i++) {
    const code = specs[i].split(':')[0];
    const value = specs[i].split(':')[1];
    const enumCode = enumGenerated[code];
    const scale = options[enumCode] ? options[enumCode].scale : '';

    const filter = `${enumCode}(${value}${scale})`;
    translated = translated
      ? translated + ' ' + filter
      : filter;
  }
  return translated;
}

// get Percent of longivity before die
// 100 is full ok, 0 is dead
export const buildProgress = (dateCreated: Date, durability: number) => {
  if (!dateCreated) return 0;
  const created = new Date(dateCreated).getTime();
  const now = new Date().getTime();
  const day = 24 * 60 * 60 * 1000;
  const deadline = day * durability;
  let compare = (1 - ((now - created) / deadline)) * 100;
  compare = compare < 0 ? 0 : compare;
  return parseInt( compare + '');
}
