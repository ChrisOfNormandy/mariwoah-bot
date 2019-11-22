const fishing = require('../../../minigames/games/fishing/core');
const mining = require('../../../minigames/games/mining/core');
const gathering = require('../../../minigames/games/gathering/core');

module.exports = function (message) {
    let msgArray = message.content.split(' ');

    if (msgArray[1]) {
        switch (msgArray[1]) {
            case 'fish': {
                fishing.sellInv(message);
                break;
            }
            case 'ores': {
                message.channel.send('Not implemented.');
                break;
            }
            case 'items': {
                gathering.sellInv(message);
                break;
            }
        }
    }
    else {
        message.channel.send('_Info will go here on inventory total worths._');
    }
}