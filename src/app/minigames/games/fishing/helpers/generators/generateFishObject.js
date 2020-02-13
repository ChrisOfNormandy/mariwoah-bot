const itemlist = require('../../../../helpers/items/itemlist');
const loot = require('./lootPool');
const newItem = require('../../../../helpers/items/newItem');

module.exports = function (level, tier) {
    let sect = loot.pool.fish[tier].length;
    let index = Math.floor(Math.random() * sect);
    let fishToUse = itemlist.fish[tier][loot.pool.fish[tier][index]];

    let maxSize = (level < 72)
        ? (level <= 50)
            ? (level <= 30)
                ? (level <= 10 && level > 0)
                    ? Number((fishToUse.maxSize / 10).toFixed(2))
                    : Number((fishToUse.maxSize / 5).toFixed(2))
                : Number((fishToUse.maxSize / 2).toFixed(2))
            : Number(((4 / 5) * fishToUse.maxSize).toFixed(2))
        : fishToUse.maxSize;

    let size = Number(((Math.random() * (maxSize - fishToUse.minSize) + 1) + fishToUse.minSize).toFixed(2));
    if (size < fishToUse.minSize)
        size = fishToUse.minSize;
    let tR = newItem.fish(1, tier, loot.pool.fish[tier][index], { size: size });

    return tR;
}