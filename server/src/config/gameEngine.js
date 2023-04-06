// Coherence with front needed here
const profiles = {
	'farmer': {
		pocketSize: 7,
		typeCount: 5,//nb of token you can create
		typeRandom: true,// random token
		questCount: 5, //nb of token you need for a quest
		sell: { // xp bonus for (%)?
			farmer: 0,
			manager: 50,
			cook: 50,
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
		questLimit: 24,// hours after you can validate a new quest
	},
};

const notifType = {
	'questVictory': 1,
	'levelUp': 2,
	'synchronize': 3,
	'createUser': 4,
	'mintToken': 5,
	'transferToken': 6,
	'deleteToken': 7,
	'createAd': 8,
	'burnout': 9,
};

// should be the same on front
const actionPoints = {
	'acceptedOffer': 500,
	'buyOfferToSmallLevel': 700,
	'mintToken': 100,
	'fusionTokenValid': 400,
	'questCompleted': 900,
}

// should be the same on front
const limitGame = {
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
};

const calculPocketSize = (experience, startPocket) => {
	const level = experience > 100 ? levelDisplay(experience) : 1;
	const pocket = startPocket + levelDisplay(level);
	return pocket > limitGame.pocket ? limitGame.pocket : pocket;
}

// same on front
// how to add ?
// if add cook/manager, need update typeCount
const type = {
	'000001': { 'profile': 'farmer', 'name': 'eggplant' },
	'000002': { 'profile': 'farmer', 'name': 'banana' },
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
	'000024': { 'profile': 'farmer', 'name': 'lettuce' },
	'000025': { 'profile': 'farmer', 'name': 'tomato' },
	'000026': { 'profile': 'farmer', 'name': 'meat' },
	'000027': { 'profile': 'farmer', 'name': 'rutabaga' },
	'000028': { 'profile': 'farmer', 'name': 'pasta' },
	'001000': { 'profile': 'cook', 'name': 'recipe' },
	'001001': { 'profile': 'cook', 'name': 'gloubiboulga', 'percent': 100 },
	'001002': { 'profile': 'cook', 'name': 'colored_cubes', 'percent': 80 },
	'001003': { 'profile': 'cook', 'name': 'soup', 'percent': 50 },
	'001004': { 'profile': 'cook', 'name': 'strange_mix', 'percent': 30 },
	'001005': { 'profile': 'cook', 'name': 'failed_recipe', 'percent': 0 },
	'002000': { 'profile': 'manager', 'name': 'coin' },
	'002001': { 'profile': 'manager', 'name': 'box' },
};

const getRandomType = (current=[], profile, typeCount) => {
	let typeAvailable = Object.keys(type).filter(e => profile ? type[e].profile == profile : true);
	
	if (current.length > 0)
		typeAvailable = Object.keys(type).filter(e => {
			if (type[e].profile == profile)
				return current.indexOf(e) == -1
			return profile ? false : true;
		});
	
	const typeRandom = profile ? profiles[profile].typeRandom : true;
	if (typeAvailable.length < typeCount || !typeRandom)
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
	return parseInt(Math.cbrt((4*xp) / 5) + '');
};

const buildUpdatedUser = (exp, gainExp, tx, type) => {
	const maxLevel = limitGame.maxLevel;
	if (levelDisplay(exp) >= maxLevel)
		return tx ? { transaction: tx + 1 } : { experience: exp };

	const oldLevel = exp > 100 ? levelDisplay(exp) : 1;
	const nExp = exp + gainExp;
	const nLvl = levelDisplay(nExp);
	const isNewLvl = nLvl > oldLevel;
	const updatedUser = {
		experience: nExp,
		pocket: calculPocketSize(nExp, profiles[type].pocketSize),
	};
	if (tx != null)
		updatedUser['transactions'] = tx + 1;
	
	// New Level ! Update TokenBuildable
	if (isNewLvl) {
		updatedUser['tokenBuildable'] = getRandomType([], type, profiles[type].typeCount); 
	}
	return updatedUser;
};

// Same on Front
// Compare list ingredients in a list of recipes
// with ingredients selected
// params:
//// recipes ex: [ '0004;0005', ... ]
//// ingredients ex: [ '0004;0005' ] 
// ret: higher % of combinaison successfull
// same in server
const recipeCondition = (recipes, ingredients) => {
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

// Get Token for the percent - same as front
const getRecipePercent = (nameTypeToken, percent) => {
	const recipes = Object.keys(nameTypeToken).filter((e) => nameTypeToken[e].profile === 'cook' && nameTypeToken[e].percent !== undefined);
	const recipeDetails = recipes.map((e) => ({ ...nameTypeToken[e], id: e }));
	let recipe = recipeDetails.filter((e) => e.percent === 0)[0];
	for (let i = 0; i < recipeDetails.length; i++) {
		if (percent >= recipeDetails[i].percent)
			recipe = recipe && recipe.percent < recipeDetails[i].percent ? recipeDetails[i] : recipe;
	}
	return recipe;
}


// get Percent of longivity before die
// 100 is full ok, 0 is dead
const buildProgress = (dateCreated, durability) => {
  if (!dateCreated) return 0;
  const created = new Date(dateCreated).getTime();
  const now = new Date().getTime();
  const day = 24 * 60 * 60 * 1000;
  const deadline = day * durability;
  let compare = (1 - ((now - created) / deadline)) * 100;
  compare = compare < 0 ? 0 : compare;
  return parseInt( compare + '');
}

// same on frontend/config
const configOnChain = [
  { 
    color: '#38ff00',
    name: 'Mainnet',
    ready: false,
    url: 'wss://xrplcluster.com',
    faucet: '',
    explorer: 'https://mainnet.xrpl.org/',
  }, {
    color: '#ffef00', 
    name: 'Testnet',
    ready: true,
    url: 'wss://s.altnet.rippletest.net:51233',
    faucet: 'https://xrpl.org/xrp-testnet-faucet.html',
    explorer: 'https://testnet.xrpl.org',
  }, {
    color: '#ffef00', 
    name: 'Devnet',
    ready: false,
    url: 'wss://s.devnet.rippletest.net:51233',
    faucet: 'https://xrpl.org/xrp-testnet-faucet.html',
  }, {
    color: '#ffef00', 
    name: 'AMM-Devnet',
    ready: false,
    url: 'wss://amm.devnet.rippletest.net:51233',
    faucet: 'https://xrpl.org/xrp-testnet-faucet.html',
  }, {
    color: '#ff3000', 
    name: 'XUMM-Testnet',
    ready: true,
    url: 'wss://hooks-testnet-v2.xrpl-labs.com',
    faucet: 'https://hooks-testnet-v2.xrpl-labs.com',
    explorer: 'https://hooks-testnet-v2-explorer.xrpl-labs.com/',
  },
];

module.exports = {
	profiles,
	notifType,
	actionPoints,
	limitGame,
	calculPocketSize,
	type,
	getRandomType,
	levelDisplay,
	buildUpdatedUser,
	recipeCondition,
	getRecipePercent,
	buildProgress,
	configOnChain,
};