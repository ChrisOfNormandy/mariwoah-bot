const mapToJson = require('./src/app/common/bot/helpers/mapToJson');
const common = require('./src/app/common/core');

function onrestart() {
    console.log(common.minigames.stats);
}

onrestart();