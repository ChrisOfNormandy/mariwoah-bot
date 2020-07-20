const fishlist = require('../../itemList').fish;
const getPrice = require('./getPrice');

module.exports = function (invArray) {
    let payout = 0;
    let fish;
    let msg = '';

    for (let i in invArray) {
        try {
            fish = getPrice(fishlist.common[invArray[i].type].costPerLb, invArray[i].weight);
            msg += `Sold ${invArray[i].type} at $${fish.price}/lb. Recieved: $${fish.salePrice}\n`
            payout += fish.salePrice;
        }
        catch (e) {
            console.log(e);
        }
    }
    return {
        payout: payout,
        message: msg
    }
}