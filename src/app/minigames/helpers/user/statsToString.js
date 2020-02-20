const chatFormat = require('../../../common/bot/helpers/global/chatFormat');
const Discord = require('discord.js');

module.exports = function (message, obj) {
    let embedMsg = new Discord.RichEmbed()
        .setTitle(`Stats for ${obj.definition.name}`)
        .setColor(chatFormat.colors.byName.darkgreen)
        .addField('General',
            `Money      | $ ${obj.stats.money}\n` +
            `Experience | ${obj.stats.experience}`)
        .addField('Minigames',
            `Fishing    | Level ${obj.stats.games.fishing.level}\n` +
            `           | Catch / Miss: ${obj.stats.games.fishing.catches} / ${obj.stats.games.fishing.misses}\n` +
            `Gathering  | Level ${obj.stats.games.gathering.level}\n` +
            `           | Catch / Miss: ${obj.stats.games.gathering.catches} / ${obj.stats.games.gathering.misses}\n` +
            `Mining     | Level ${obj.stats.games.mining.level}\n` +
            `           | Catch / Miss: ${obj.stats.games.mining.catches} / ${obj.stats.games.mining.misses}\n`
        )
        .addField('Gambling',
        `> Slots        | Wins  | ${obj.stats.games.gambling.slots.wins}\n` +
        `               | Loses | ${obj.stats.games.gambling.slots.loses}\n` +
        `               | Gain  | $ ${(obj.stats.games.gambling.slots.totalWins).toFixed(2)}\n` +
        `               | Lost  | $ ${(obj.stats.games.gambling.slots.totalLoses).toFixed(2)}\n` +
        `            ---|-------|---\n` +
        `> Blackjack    | Wins  | ${obj.stats.games.gambling.blackjack.wins}\n` +
        `               | Loses | ${obj.stats.games.gambling.blackjack.loses}\n` +
        `               | Gain  | $ ${(obj.stats.games.gambling.blackjack.totalWins).toFixed(2)}\n` +
        `               | Lost  | $ ${(obj.stats.games.gambling.blackjack.totalLoses).toFixed(2)}`);
    message.channel.send(embedMsg);
}