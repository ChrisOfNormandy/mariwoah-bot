const generateFishObject = require('./generators/generateFishObject');
const generateItemObject = require('./generators/generateItemObject');
const getCatchChances = require('./generators/getCatchChances');

module.exports = function (user) {
    return new Promise((resolve, reject) =>  {
        let rngValue = Math.floor(100 * Math.random());

        let chance = getCatchChances(user.level);
        chance.lowItem += chance.fish;
        chance.medItem += chance.lowItem;
        chance.highItem += chance.medItem;

        if (!chance.fish || !chance.lowItem || !chance.medItem || !chance.highItem)
            chance = { fish: 20, lowItem: 15, medItem: 9, highItem: 1 };

        let gameInstance = {
            delay: 10 - Math.floor(user.level / 10),
            chances: chance,
            rngValue: rngValue,
            returnItem: null,
            expPayout: 0
        }

        if (rngValue <= chance.fish) {
            let tier = (rngValue <= Math.floor(0.75 * chance.fish)) ? 'common' : 'uncommon';
            generateFishObject(user.level, tier)
                .then(arr => {
                    gameInstance.returnItem = arr;
                    gameInstance.expPayout = Math.round(arr[1].costPerLb * arr[1].weight);

                    resolve(gameInstance);
                })
        }
        else if (rngValue > chance.fish && rngValue < chance.highItem) {
            // let tier = 'common';
            // let itemObject = generateItemObject(user.level, tier);
            // gameInstance.returnItem = itemObject;
            // gameInstance.expPayout = Math.floor(itemObject.item.worth * itemObject.item.size);
        }
        else
            resolve(gameInstance);
    });
}