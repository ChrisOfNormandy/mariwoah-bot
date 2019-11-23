const global = require('../../../main/global');

module.exports = function (costPerLb, weight) {
    let fish = {
        price:  costPerLb * weight,
        salePrice: Number(fish.price * ((Math.random() * 10) / 10).toFixed(2))
    };
    global.log(JSON.stringify(fish));
    return fish;
}