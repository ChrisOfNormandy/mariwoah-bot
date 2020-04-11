const chatFormat = require('../../../../common/bot/helpers/global/chatFormat');
const db = require('../../../../sql/adapter');
const newInstance = require('./newInstance');
const Discord = require('discord.js');

module.exports = function (message, userID) {
    db.minigames.fishing.get(message, userID)
        .then(user => {
            message.channel.send('You cast your <rod item>...')
                .then(msg => {
                    newInstance(user)
                        .then(instance => {

                            if (instance.returnItem === null)
                                return console.log('Aborted');

                            console.log(instance);

                            setTimeout(() => {
                                msg.edit('Waiting...');
                            }, instance.delay * 1000 / 4);
                            setTimeout(() => {
                                msg.edit('Reeling in...');
                            }, instance.delay * 1000 * (3 / 4));
                            setTimeout(() => {
                                if (instance.returnItem !== null && instance.returnItem.length) {
                                    // modUser(user.definition.id, 'give', instance.returnItem);
                                    // modUser(user.definition.id, 'addCatch', { game: 'fishing', amount: 1, flag: 'catches' });
                                    // modUser(user.definition.id, 'levelup', { game: 'fishing', message: message })
                                    let embedMsg = new Discord.RichEmbed()
                                        .setTitle(`:fishing_pole_and_fish: ${instance.returnItem[0].name.replace('_', ' ')}`);
                                        switch(instance.returnItem[0].rarity) {
                                            case 'common': {
                                                embedMsg.setColor(chatFormat.colors.byName.lightgray);
                                                break;
                                            }
                                            case 'uncommon': {
                                                embedMsg.setColor(chatFormat.colors.byName.green);
                                                break;
                                            }
                                        }
                                    embedMsg.addField(
                                        `Rarity: ${instance.returnItem[0].rarity}`,
                                        `Weight: ${instance.returnItem[1].weight} lbs.\n` +
                                        `Size: ${instance.returnItem[1].size} inches`
                                    );
                                    msg.edit(embedMsg);
                                }
                            }, instance.delay * 1000);
                        })
                })
        })
}