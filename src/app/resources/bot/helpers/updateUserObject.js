const gaming = require('../../../minigames/gaming');

module.exports = function (message, object) {
    gaming.updateAllUsers('fishing', object);
    message.channel.send('Updated all users');
}