const global = require('../../../main/global');
const getPrice = require('./getPrice');
const fishlist = require('../../itemList').fish;

module.exports = function (invArray) {
    let payout = 0;
    let fish;
    let msg = '';
    global.log('Starting sellFish function.');
    for (i in invArray) {
        try {
            fish = getPrice(fishlist.common[invArray[i].type].costPerLb, invArray[i].weight);
            msg += `Sold ${invArray[i].type} at $${fish.price}/lb. Recieved: $${fish.salePrice}\n`
            payout += fish.salePrice;
        }
        catch (e) {
            console.log(e);
            global.log(`Exception: Error selling fish for player ${message.author.id}.`, 'error');
        }
    }
    return {
        payout: payout,
        message: msg
    }
}