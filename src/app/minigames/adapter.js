const sql = require('../sql/adapter');
const chatFormat = require('../common/bot/helpers/global/chatFormat');
const Discord = require('discord.js');
const fishing = require('./games/fishing/adapter');

function printStats(message) {
    let embed = new Discord.MessageEmbed()
        .setTitle(`Game stats for ${message.author.username}`)
        .setColor(chatFormat.colors.byName.yellow);

    return new Promise((resolve, reject) => {
        sql.minigames.getStats(message, message.author.id)
            .then(stats => {
                embed.addField('Level', stats.level, true);
                embed.addField('Experience', stats.experience, true);
                embed.addField('Balance', stats.balance);
                resolve({embed});
            })
            .catch(e => reject(e));
    });
}

function printStats_fishing(message) {
    let embed = new Discord.MessageEmbed()
        .setTitle(`Fishing stats for ${message.author.username}`)
        .setColor(chatFormat.colors.byName.yellow);
    
    return new Promise((resolve, reject) => {
        sql.minigames.fishing.get(message, message.author.id)
            .then(stats => {
                embed.addField('Level', stats.level, true);
                embed.addField('Experience', stats.experience, true);
                embed.addField('Returns', `*Catches*: ${stats.catches}\n*Misses*: ${stats.misses}\n*Trash*: ${stats.trash}`);
                resolve({embed});
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
        find: (message, data) => {return sql.minigames.inventory.find(message, data)}
    },
    fishing: {
        cast: (message) => {return fishing.cast(message)}
    }
}