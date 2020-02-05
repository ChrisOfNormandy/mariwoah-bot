const createUser = require('./helpers/user/createUser');
const getUser = require('./helpers/user/getUser');
const modUser = require('./helpers/user/modUser');
const statsMap = require('./helpers/user/statsMap');
const listStats = require('./helpers/user/statsToString');
const listInv = require('./helpers/inventory/list');
const sellInv = require('./helpers/inventory/sell');

const gambling = require('./games/gambling/adapter');
const fishing = require('./games/fishing/adapter');

module.exports = {
    stats: statsMap.map,
    mapStats: require('./helpers/user/mapStats'),

    getUser: function(message) {return getUser(message);},
    createUser: (message) => createUser(message),
    listStats: function(message) {listStats(message, this.getUser(message));},
    modUser: function(userID, action, argsObject) {modUser(userID, action, argsObject);},

    listInv: function(message) {
        let msgs = listInv(statsMap.map.get(message.author.id));
        if (!msgs.length) message.channel.send('Nothing found.');
        else for (i in msgs) message.channel.send(msgs[i]);
        message.delete();
    },
    sellInv: function(message) {
        let sold = sellInv(statsMap.map.get(message.author.id));
        let total = 0;
        let msg = '';
        let name = '';
        for (obj in sold) {
            name = obj.charAt(0).toUpperCase() + obj.slice(1);
            name = name.replace('_', ' ');

            msg += `x${sold[obj].amount} ${name} - $${(sold[obj].price).toFixed(2)}\n`;
            total += sold[obj].price;
        }
        if (total == 0 && msg == '') message.channel.send('Nothing to sell.');
        else {
            message.channel.send('```cs\n# Sold:\n' + msg + '```');
            this.pay(message.author.id, total);
        }
        message.delete();
    },

    pay: function(userID, amount) {modUser(userID, 'pay', {amount: amount});},
    giveXp: function(userID, amount) {modUser(userID, 'giveXp', {amount: amount});},

    run: function(message, section, game = null) {
        switch(section) {
            case 'gambling': {
                if (game == null) return;
                let obj = gambling.run(message, game, getUser);
                if (obj == null) return;
                
                this.pay(message.author.id, obj);
                this.modUser(message.author.id, 'gain', {amount: obj, game: game});
            }
            case 'fishing': {
                if (game == 'cast') {
                    fishing.cast(message);
                }
            }
        }
    }
}