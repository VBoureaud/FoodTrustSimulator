const profiles = {
	'farmer': {
		pocketSize: 7,
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

const actionPoints = {
	'acceptedOffer': 500,
	'buyOfferToSmallLevel': 700,
	'mintToken': 100,
	'questCompleted': 900,
}

const limitGame = {
	'pocket': 50,
	'smallProfile': 2000,
}

const calculPocketSize = (experience, startPocket) => {
	const level = experience > 100 ? levelDisplay(experience / 100) : 1;
	const pocket = startPocket + levelDisplay(level);
	return pocket > limitGame.pocket ? limitGame.pocket : pocket;
}

const type = {
	'000001': { 'profile': 'farmer', 'name': 'eggplant' },
	'000002': { 'profile': 'farmer', 'name': 'banane' },
	'000003': { 'profile': 'farmer', 'name': 'broccoli' },
	'000004': { 'profile': 'farmer', 'name': 'carrot' },
	'000005': { 'profile': 'farmer', 'name': 'cherry' },
	'000006': { 'profile': 'farmer', 'name': 'mushroom' },
	'000007': { 'profile': 'farmer', 'name': 'cheese' },
	'000008': { 'profile': 'farmer', 'name': 'lemon' },
	'000009': { 'profile': 'farmer', 'name': 'pumpkin' },
	'000010': { 'profile': 'farmer', 'name': 'cucumber' },
	'000011': { 'profile': 'farmer', 'name': 'zucchini' },
	'000012': { 'profile': 'farmer', 'name': 'shrimp' },
	'000013': { 'profile': 'farmer', 'name': 'croissant' },
	'000014': { 'profile': 'farmer', 'name': 'corn' },
	'000015': { 'profile': 'farmer', 'name': 'mango' },
	'000016': { 'profile': 'farmer', 'name': 'melon' },
	'000017': { 'profile': 'farmer', 'name': 'honey' },
	'000018': { 'profile': 'farmer', 'name': 'eggs' },
	'000019': { 'profile': 'farmer', 'name': 'potato' },
	'000020': { 'profile': 'farmer', 'name': 'chilli_pepper' },
	'000021': { 'profile': 'farmer', 'name': 'leek' },
	'000022': { 'profile': 'farmer', 'name': 'pear' },
	'000023': { 'profile': 'farmer', 'name': 'turnip' },
	'000024': { 'profile': 'farmer', 'name': 'salad' },
	'000025': { 'profile': 'farmer', 'name': 'tomato' },
	'000026': { 'profile': 'farmer', 'name': 'meat' },
	'000027': { 'profile': 'farmer', 'name': 'rutabaga' },
	'001000': { 'profile': 'cook', 'name': 'pasta' },
};

const getRandomType = (current=[], profile) => {
	let typeAvailable;
	const typeCount = profiles[profile].typeCount;
	typeAvailable = Object.keys(type).filter(e => type[e].profile == profile);
	
	if (current.length > 0)
		typeAvailable = Object.keys(type).filter(e => current.indexOf(e) == -1);
	
	if (typeAvailable.length < typeCount || !profiles[profile].typeRandom)
		return typeAvailable.slice(0, profiles[profile].typeCount);
	
	const typesChoosed = [];
	let random;
	while (typesChoosed.length != typeCount) {
		random = Math.floor(Math.random() * typeAvailable.length);
		if (typesChoosed.indexOf(typeAvailable[random]) == -1)
			typesChoosed.push(typeAvailable[random]);
	}
	return typesChoosed;
};

const levelDisplay = (xp) => {
  const coef = 2;
  return parseInt((coef * Math.log(xp)) + '');
};

const buildUpdatedUser = (exp, gainExp, tx) => {
	const oldLevel = exp > 100 ? levelDisplay(exp) : 1;
  const nExp = exp + gainExp;
  const nLvl = levelDisplay(nExp / 100);
  const isNewLvl = nLvl > oldLevel;
  const updatedUser = {
    experience: nExp,
    pocket: calculPocketSize(nExp, profiles.farmer.pocketSize),
  };
  if (tx != null)
  	updatedUser['transactions'] = tx + 1;
  
  // New Level ! Update TokenBuildable
  if (isNewLvl) {
    updatedUser['tokenBuildable'] = getRandomType([], 'farmer'); 
  }
  return updatedUser;
};


module.exports = {
	profiles,
	actionPoints,
	limitGame,
	calculPocketSize,
	type,
	getRandomType,
	levelDisplay,
	buildUpdatedUser,
};