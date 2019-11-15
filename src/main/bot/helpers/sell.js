const fishing = require('../../../minigames/fishing/core');
const mining = require('../../../minigames/mining/core');
const gathering = require('../../../minigames/gathering/core');

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