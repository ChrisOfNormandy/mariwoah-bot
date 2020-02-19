const fishingLoot = require('../../../minigames/games/fishing/helpers/generators/lootPool');
const minigames = require('../../../minigames/core');
const statsMap = require('../../../minigames/helpers/user/statsMap');

module.exports = async function () {
    statsMap.map = minigames.mapStats();
    minigames.stats = statsMap.map;

    fishingLoot.generate();
}