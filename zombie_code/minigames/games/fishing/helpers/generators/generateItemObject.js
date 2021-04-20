const loot = require('./lootPool');
const newItem = require('../../../../helpers/items/newItem');

module.exports = function (level, tier = 'common') {
    let sect = loot.pool.items[tier].length;
    let index = Math.floor(Math.random() * sect);

    return newItem.item(1, tier, loot.pool.items[tier][index], { size: 0 })
}