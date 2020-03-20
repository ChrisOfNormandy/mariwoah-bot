const fishingLoot = require('../../../minigames/games/fishing/helpers/generators/lootPool');
const minigames = require('../../../minigames/core');
const statsMap = require('../../../minigames/helpers/user/statsMap');
const db = require('../../../sql/adapter');

module.exports = async function () {
    db.startup();
    statsMap.map = minigames.mapStats();
    minigames.stats = statsMap.map;

    fishingLoot.generate();
}