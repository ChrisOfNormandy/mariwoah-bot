const db = require('../sql/adapter');
const chatFormat = require('../common/bot/helpers/global/chatFormat');
const Discord = require('discord.js');
const fishing = require('./games/fishing/adapter');

function printStats(message) {
    let embedMsg = new Discord.MessageEmbed()
        .setTitle(`Game stats for ${message.author.username}`)
        .setColor(chatFormat.colors.byName.yellow);

    return new Promise((resolve, reject) => {
        db.minigames.getStats(message, message.author.id)
            .then(stats => {
                embedMsg.addField('Level', stats.level, true);
                embedMsg.addField('Experience', stats.experience, true);
                embedMsg.addField('Balance', stats.balance);
                resolve(embedMsg);
            })
            .catch(e => reject(e));
    });
}

function printStats_fishing(message) {
    let embedMsg = new Discord.MessageEmbed()
        .setTitle(`Fishing stats for ${message.author.username}`)
        .setColor(chatFormat.colors.byName.yellow);
    
    return new Promise((resolve, reject) => {
        db.minigames.fishing.get(message, message.author.id)
            .then(stats => {
                embedMsg.addField('Level', stats.level, true);
                embedMsg.addField('Experience', stats.experience, true);
                embedMsg.addField('Returns', `*Catches*: ${stats.catches}\n*Misses*: ${stats.misses}\n*Trash*: ${stats.trash}`);
                resolve(embedMsg);
            })
            .catch(e => reject(e));
    });
}

module.exports = {
    stats: {
        all: (message) => {return printStats(message)},
        fishing: (message) => {return printStats_fishing(message)}
    },
    inventory: {
        find: (message, data) => {return db.minigames.inventory.find(message, data)}
    },
    fishing: {
        cast: (message) => {return fishing.cast(message)}
    }
}

// const createUser = require('./helpers/user/createUser');
// const fishing = require('./games/fishing/adapter');
// const gambling = require('./games/gambling/adapter');
// const getUser = require('./helpers/user/getUser');
// const listInv = require('./helpers/inventory/list');
// const listStats = require('./helpers/user/statsToString');
// const modUser = require('./helpers/user/modUser');
// const sellInv = require('./helpers/inventory/sell');

// module.exports = {
//     stats: statsMap.map,
//     mapStats: require('./helpers/user/mapStats'),

//     getUser: function (message) { return getUser(message); },
//     createUser: (message) => createUser(message),
//     listStats: function (message) { listStats(message, this.getUser(message)); },
//     modUser: function (userID, action, argsObject) { modUser(userID, action, argsObject); },

//     listInv: function (message) {
//         let msgs = listInv(statsMap.map.get(message.author.id));
//         if (!msgs.length)
//             message.channel.send('Nothing found.');
//         else
//             for (let i in msgs)
//                 message.channel.send(msgs[i]);
//         try {
//             message.delete();
//         }
//         catch (e) {
//             message.channel.send('I require admin permissions to operate correctly.');
//         }
//     },
//     sellInv: function (message) {
//         let sold = sellInv(statsMap.map.get(message.author.id));
//         let total = 0;
//         let msg = '';
//         let name = '';

//         for (let obj in sold) {
//             name = obj.charAt(0).toUpperCase() + obj.slice(1);
//             name = name.replace('_', ' ');

//             msg += `x${sold[obj].amount} ${name} - $${(sold[obj].price).toFixed(2)}\n`;
//             total += sold[obj].price;
//         }
//         if (total == 0 && msg == '')
//             message.channel.send('Nothing to sell.');
//         else {
//             message.channel.send('```cs\n# Sold:\n' + msg + '```');
//             this.pay(message.author.id, total);
//         }
//         try {
//             message.delete();
//         }
//         catch (e) {
//             message.channel.send('I require admin permissions to operate correctly.');
//         }
//     },

//     pay: function (userID, amount) { modUser(userID, 'pay', { amount: amount }); },
//     giveXp: function (userID, amount) { modUser(userID, 'giveXp', { amount: amount }); },

//     run: function (message, section, game = null) {
//         switch (section) {
//             case 'gambling': {
//                 if (game == null)
//                     return;
//                 let obj = gambling.run(message, game, getUser);
//                 if (obj == null)
//                     return;

//                 this.pay(message.author.id, obj);
//                 this.modUser(message.author.id, 'gain', { amount: obj, game: game });
//             }
//             case 'fishing': {
//                 if (game == 'cast')
//                     fishing.cast(message);
//             }
//         }
//     }
// }