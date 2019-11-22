const continueGame = require('./helpers/continueGame');
const newGame = require('./helpers/newGame');
const listHand = require('../../helpers/listHand');

module.exports = {
    instances: new Map(),

    execute: function(message) {
        if (this.instances.has(message.author.id)) {
            if (message.content.split(' ').length == 1) {
                message.channel.send(`Player:\n${listHand(this.instances.get(message.author.id).playerHand)}`);
                return null;
            }
            else {
                let ret = continueGame(message, this.instances.get(message.author.id), this.instances);
                if (ret) {
                    this.instances = ret.instances;
                    return ret.game;
                }
            }
        }
        else {
            this.instances.set(message.author.id, newGame(message));
            return null;
        }
    }
}