const newGame = require('./helpers/newGame');

function listCombos(message) {
    let msg = '';
    for (s in slotItems) {
        if (s == 'x')
            msg += `> :${s}: BUST\n`;
        else
            msg += `> :${s}: = 1/2 ~ ${slotItems[s].worth[0]} | 3/4 ~ ${slotItems[s].worth[1]} | 5 ~ ${slotItems[s].worth[2]}\n`;
    }
    message.channel.send(msg);
}

module.exports = {
    instances: new Map(),

    execute: function (message, user) {
        if (this.instances.has(message.author.id))
            return null;
        else {
            let val = newGame(message, user);
            if (val == -1)
                return;
            this.instances.set(message.author.id, val);
            return null;
        }
    },

    list: function (message) {
        listCombos(message);
    }
}