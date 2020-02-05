const minigames = require('../../../minigames/core');
const statsMap = require('../../../minigames/helpers/user/statsMap');
const paths = require('./paths');
const serverMap = require('../../roleManager/helpers/servers/serverMap');
const jsonFileToMap = require('./jsonFileToMap');

const fishingLoot = require('../../../minigames/games/fishing/helpers/generators/lootPool');

module.exports = async function() {
    statsMap.map = minigames.mapStats();
    minigames.stats = statsMap.map;

    jsonFileToMap(paths.roleManagerServers)
    .then(map => {
        console.log('Server map: ' + map);
        serverMap.map = map;
    })
    .catch(e => console.log(e));


    fishingLoot.generate();
}