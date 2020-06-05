const levelup = require('./levelup');
const pushStats = require('./pushStats');
const statsMap = require('./statsMap');

module.exports = function (userID, action, argsObject) {
    if (!statsMap.map.has(userID))
        return;
    let user = statsMap.map.get(userID);

    switch (action) {
        case 'pay': {
            if (!argsObject.amount)
                return;
            user.stats.money += Number(argsObject.amount);
            break;
        }
        case 'giveXp': {
            if (!argsObject.amount)
                return;
            user.stats.experience += argsObject.amount;
            break;
        }
        case 'give': {
            if (!argsObject)
                return;

            switch (argsObject.category) {
                case 'items': {
                    let flag = true;
                    let i = 0;

                    while (flag && i < user.inventories.items.length) {
                        if (user.inventories.items[i].item.name == argsObject.item.name) {
                            user.inventories.items[i].amount++;
                            flag = false;
                        }
                    }
                    if (flag)
                        user.inventories.items.push(argsObject);
                    break;
                }
                case 'fish': {
                    user.inventories.fish.push(argsObject);
                    break;
                }
            }
            break;
        }
        case 'addCatch': {
            if (!argsObject.game || !argsObject.amount || !argsObject.flag)
                return;
            user.stats.games[argsObject.game][argsObject.flag] += Number(argsObject.amount);
            return;
        }
        case 'gain': {
            if (!argsObject.amount || !argsObject.game)
                return;
            if (argsObject.amount > 0) {
                user.stats.games.gambling[argsObject.game].totalWins += argsObject.amount;
                user.stats.games.gambling[argsObject.game].wins += 1;
            }
            else {
                user.stats.games.gambling[argsObject.game].totalLoses += -1 * argsObject.amount;
                user.stats.games.gambling[argsObject.game].loses += 1;
            }
        }
        case 'levelup': {
            if (!argsObject.game || !argsObject.message)
                return;
            user = levelup.set(user, argsObject.game);
            if (!user)
                return;
            argsObject.message.channel.send(`Congrats <@${argsObject.message.author.id}>! You leveled up in ${argsObject.game}.\n` +
                `**New level**: ${user.stats.games[argsObject.game].level}\n` +
                `_To next level_: ${levelup.get(user.stats.games[argsObject.game].level)} catches.`
            );
        }
    }
    pushStats();
}