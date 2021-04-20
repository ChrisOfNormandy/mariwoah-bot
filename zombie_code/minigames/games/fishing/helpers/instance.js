const generateFishObject = require('./generators/generateFishObject');
const generateItemObject = require('./generators/generateItemObject');
const getCatchChances = require('./generators/getCatchChances');

const map = new Map();

function generate(message, user) {
    return new Promise((resolve, reject) =>  {
        let rngValue = Math.floor(100 * Math.random());
        // let rngValue = 0;

        let chance = getCatchChances(user.level);
        chance.lowItem += chance.fish;
        chance.medItem += chance.lowItem;
        chance.highItem += chance.medItem;

        if (!chance.fish || !chance.lowItem || !chance.medItem || !chance.highItem)
            chance = { fish: 20, lowItem: 15, medItem: 9, highItem: 1 };

        let gameInstance = {
            channel: message.channel,
            user: message.author,
            delay: Math.abs(10 - Math.floor(user.level / 10)),
            chances: chance,
            rngValue: rngValue,
            returnItem: null,
            expPayout: 0,
            returnType: null
        }

        if (rngValue <= chance.fish) {
            let tierMax = 5 * Math.round(0.2 * user.level / 20);
            let tier = Math.round(Math.random() * tierMax);

            gameInstance.returnType = 'fish';

            generateFishObject(user.level, tier)
                .then(fish => {
                    gameInstance.returnItem = fish;
                    gameInstance.expPayout = Math.round(fish.price_per_pound * fish.weight);
                    resolve(gameInstance);
                })
        }
        else if (rngValue > chance.fish && rngValue < chance.highItem) {
            // let tier = 'common';
            // let itemObject = generateItemObject(user.level, tier);
            // gameInstance.returnItem = itemObject;
            // gameInstance.expPayout = Math.floor(itemObject.item.worth * itemObject.item.size);
            resolve(gameInstance);
        }
        else
            resolve(gameInstance);
    });
}

function set(message, user) {
    return new Promise((resolve, reject) => {
        generate(message, user)
            .then(instance => {
                map.set(`${user.server_id},${user.user_id}`, instance);
                resolve(instance);
            })
            .catch(e => reject(e));
    });
}

function get(user) {
    return map.get(`${user.server_id},${user.user_id}`);
}

function remove(user) {
    map.delete(`${user.server_id},${user.user_id}`);
}

module.exports = {
    get,
    set,
    map,
    remove
}