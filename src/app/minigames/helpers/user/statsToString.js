module.exports = function(message, obj) {
    console.log(obj);
    message.channel.send(
        '```cs\n# ' + obj.definition.name + '\n' +
        `"Money"       | $${(obj.stats.money).toFixed(2)}\n` +
        `"Experience"  | ${obj.stats.experience} xp\n` +
        '```\n' +
        '```cs\n# Minigames\n' +
        `"Fishing"     | Level ${obj.stats.games.fishing.level}\n` +
        `              | Catch/Miss: ${obj.stats.games.fishing.catches} / ${obj.stats.games.fishing.misses}\n` +
        `"Gathering"   | Level ${obj.stats.games.gathering.level}\n` +
        `              | Catch/Miss: ${obj.stats.games.gathering.catches} / ${obj.stats.games.gathering.misses}\n` +
        `"Mining"      | Level ${obj.stats.games.mining.level}\n` +
        `              | Catch/Miss: ${obj.stats.games.mining.catches} / ${obj.stats.games.mining.misses}\n` +
        '```\n' +
        '```cs\n# Gambling\n' +
        `> "Slots"     | wins  | ${obj.stats.games.gambling.slots.wins}\n` +
        `              | loses | ${obj.stats.games.gambling.slots.loses}\n` +
        `              | gain  | $ ${(obj.stats.games.gambling.slots.totalWins).toFixed(2)}\n` +
        `              | lost  | $ ${(obj.stats.games.gambling.slots.totalLoses).toFixed(2)}\n` +
        `--------------|-------------------------\n` +
        `> "Blackjack" | wins  | ${obj.stats.games.gambling.blackjack.wins}\n` +
        `              | loses | ${obj.stats.games.gambling.blackjack.loses}\n` +
        `              | gain  | $ ${(obj.stats.games.gambling.blackjack.totalWins).toFixed(2)}\n` +
        `              | lost  | $ ${(obj.stats.games.gambling.blackjack.totalLoses).toFixed(2)}\n` +
        '```'
    );
}