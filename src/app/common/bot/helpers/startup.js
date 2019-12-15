const minigames = require('../../../minigames/core');
const statsMap = require('../../../minigames/helpers/user/statsMap');

const fishingLoot = require('../../../minigames/games/fishing/helpers/generators/lootPool');

module.exports = function() {
    statsMap.map = minigames.mapStats();
    minigames.stats = statsMap.map;

    fishingLoot.generate();
}