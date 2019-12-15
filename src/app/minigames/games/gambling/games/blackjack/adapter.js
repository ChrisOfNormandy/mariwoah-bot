const continueGame = require('./helpers/continueGame');
const newGame = require('./helpers/newGame');
const listHand = require('../../helpers/listHand');

module.exports = {
    instances: new Map(),

    execute: function(message, user) {
        if (this.instances.has(message.author.id)) {
            if (message.content.split(' ').length == 1) {
                message.channel.send(`Player:\n${listHand(this.instances.get(message.author.id).playerHand)}`);
                return null;
            }
            else {
                let ret = continueGame(message, this.instances.get(message.author.id));
                if (ret) {
                    this.instances.delete(message.author.id);
                    return ret.game;
                }
            }
        }
        else {
            let val = newGame(message, user);
            if (val == -1) return;
            this.instances.set(message.author.id, val);
            return null;
        }
    }
}