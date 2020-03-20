const generateFishObject = require('./generators/generateFishObject');
const generateItemObject = require('./generators/generateItemObject');
const getCatchChances = require('./generators/getCatchChances');

module.exports = function (user) {
    return new Promise(function (resolve, reject) {
        let rngValue = Math.floor(100 * Math.random());

        let chance = getCatchChances(user.stats.games.fishing.level);
        chance.lowItem += chance.fish;
        chance.medItem += chance.lowItem;
        chance.highItem += chance.medItem;

        if (!chance.fish || !chance.lowItem || !chance.medItem || !chance.highItem)
            chance = { fish: 20, lowItem: 15, medItem: 9, highItem: 1 };

        let gameInstance = {
            delay: 10 - Math.floor(user.stats.games.fishing.level / 10),
            chances: chance,
            rngValue: rngValue,
            returnItem: null,
            expPayout: 0
        }

        if (rngValue <= chance.fish) {
            let tier = (rngValue <= Math.floor(0.75 * chance.fish)) ? 'common' : 'uncommon';
            let fishObject = generateFishObject(user.stats.games.fishing.level, tier);
            gameInstance.returnItem = fishObject;
            gameInstance.expPayout = Math.round(fishObject.item.info.costPerLb * fishObject.item.weight);
        }
        else if (rngValue > chance.fish && rngValue < chance.highItem) {
            let tier = 'common';
            let itemObject = generateItemObject(user.stats.games.fishing.level, tier);
            gameInstance.returnItem = itemObject;
            gameInstance.expPayout = Math.floor(itemObject.item.worth * itemObject.item.size);
        }

        resolve(gameInstance);
    });
}