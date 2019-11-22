const minigames = require('../../../minigames/core');

module.exports = function() {
    minigames.stats = minigames.mapStats();
    console.log(minigames.stats);
}