const gameEngine = require('./gameEngine');

// UNIT TEST FOR GAME ENGINE
test("getRandomType init", () => {
	const profile = 'farmer';
	const types = gameEngine.getRandomType([], profile, gameEngine.profiles[profile].typeCount);
	expect(types.length).toBe(gameEngine.profiles[profile].typeCount);
});

test("getRandomType with old", () => {
	const profile = 'farmer';
	const types = gameEngine.getRandomType(
		[ '000006', '000020', '000010', '001000', '000017' ], profile, gameEngine.profiles[profile].typeCount);
	expect(types.length).toBe(gameEngine.profiles[profile].typeCount);
});

test("getRandomType cook", () => {
	const profile = 'cook';
	const types = gameEngine.getRandomType([], profile, gameEngine.profiles[profile].typeCount);
	expect(types.length).toBe(gameEngine.profiles[profile].typeCount);
});

test("getRandomType manager", () => {
	const profile = 'manager';
	const types = gameEngine.getRandomType([], profile, gameEngine.profiles[profile].typeCount);
	expect(types.length).toBe(gameEngine.profiles[profile].typeCount);
});