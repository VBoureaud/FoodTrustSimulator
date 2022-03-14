// Coherence with server needed here
export const profiles = {
  'farmer': {
    pocketSize: 10,
    typeCount: 5,
    typeRandom: true,
    sellBonus: 1,
  },
  'manager': {
    pocketSize: 70,
    typeCount: 5,
    typeRandom: false,
    sellBonus: 5,
  },
  'cook': {
    pocketSize: 7,
    typeCount: 1,
    typeRandom: false,
    sellBonus: 4,
  },
};

type NameTypeToken = {
  [x: string]: {
    name: string;
  };
};

export const nameTypeToken: NameTypeToken = {
  '000001': { 'name': 'eggplant' },
  '000002': { 'name': 'banane' },
  '000003': { 'name': 'broccoli' },
  '000004': { 'name': 'carrot' },
  '000005': { 'name': 'cherry' },
  '000006': { 'name': 'mushroom' },
  '000007': { 'name': 'cheese' },
  '000008': { 'name': 'lemon' },
  '000009': { 'name': 'pumpkin' },
  '000010': { 'name': 'cucumber' },
  '000011': { 'name': 'zucchini' },
  '000012': { 'name': 'shrimp' },
  '000013': { 'name': 'croissant' },
  '000014': { 'name': 'corn' },
  '000015': { 'name': 'mango' },
  '000016': { 'name': 'melon' },
  '000017': { 'name': 'honey' },
  '000018': { 'name': 'eggs' },
  '000019': { 'name': 'potato' },
  '000020': { 'name': 'chilli_pepper' },
  '000021': { 'name': 'leek' },
  '000022': { 'name': 'pear' },
  '000023': { 'name': 'turnip' },
  '000024': { 'name': 'salad' },
  '000025': { 'name': 'tomato' },
  '000026': { 'name': 'meat' },
  '000027': { 'name': 'rutabaga' },
  '001000': { 'name': 'pasta' },
};

export const levelDisplay = (xp: number) => {
  const coef = 2;
  return parseInt((coef * Math.log(xp)) + '');
};

export const calculNextLevel = (xp: number) => {
  const coef = 2;
  const current = parseInt((coef * Math.log(xp)) + '');
  while (current == parseInt((coef * Math.log(++xp)) + ''));
  return xp;
}

export const calculPrevLevel = (xp: number) => {
  const coef = 2;
  const current = parseInt((coef * Math.log(xp)) + '');
  
  while (xp > 0 && current == parseInt((coef * Math.log(--xp)) + ''));
  return xp;
}


type Badge = {
  [x: string]: {
    collection: number;
    transaction: number;
    pocket: number;
    minted: number;
    burn: number;
  };
};

type BadgeDesc = {
  [x: string]: string;
}
export const badgeDesc: BadgeDesc = {
  '1': '10 transactions',
  '2': '10 tokens burned',
  '3': '50 tokens',
  '4': '10 tokens minted',
  '5': '20 transactions',
  '6': '30 tokens minted',
  '7': 'Pocket size updated',
  '8': 'First Token',
}
export const badgeCondition: Badge = {
  '1': {
    collection: 0,
    transaction: 10,
    pocket: 0,
    minted: 0,
    burn: 0,
  },
  '2': {
    collection: 0,
    transaction: 0,
    pocket: 0,
    minted: 0,
    burn: 10,
  },
  '3': {
    collection: 50,
    transaction: 0,
    pocket: 0,
    minted: 0,
    burn: 0,
  },
  '4': {
    collection: 0,
    transaction: 0,
    pocket: 0,
    minted: 10,
    burn: 0,
  },
  '5': {
    collection: 0,
    transaction: 20,
    pocket: 0,
    minted: 0,
    burn: 0,
  },
  '6': {
    collection: 0,
    transaction: 0,
    pocket: 0,
    minted: 30,
    burn: 0,
  },
  '7': {
    collection: 0,
    transaction: 0,
    pocket: 11,
    minted: 0,
    burn: 0,
  },
  '8': {
    collection: 0,
    transaction: 0,
    pocket: 0,
    minted: 1,
    burn: 0,
  },
}