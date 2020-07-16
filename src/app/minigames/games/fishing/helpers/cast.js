const chatFormat = require('../../../../common/bot/helpers/global/chatFormat');
const sql = require('../../../../sql/adapter');
const instance = require('./instance');
const Discord = require('discord.js');

const assetPath = 'src/app/common/assets/items/fish/'

module.exports = function (message, userID) {
    return new Promise((resolve, reject) => {
        sql.minigames.fishing.get(message, userID)
            .then(user => {
                if (!instance.get(user)) {
                    instance.set(message, user)
                        .then(game => {
                            game.channel.send(`Casting. You will be pinged when you catch something!`)
                                .then(msg => {
                                    let count = 0;
                                    let animation = setInterval(() => {
                                        msg.edit(`Casting. You will be pinged when you catch something!\n:rowboat:\n${' '.repeat(50 - count * 5)}:fish:`);
                                        count++;
                                        if (count >= 10)
                                            clearInterval(animation);
                                    }, game.delay / 10 * 3000);

                                    setTimeout(() => {
                                        msg.delete();

                                        instance.remove(user);

                                        if (game.returnItem !== null) {
                                            let embed = new Discord.MessageEmbed();

                                            if (game.returnType == 'fish') {
                                                embed.setTitle(game.returnItem.fish.item_name);
                                                embed.setColor(chatFormat.colors.byName.cyan);
                                                embed.addField('Size', game.returnItem.size + ' inches', true);
                                                embed.addField('Weight', game.returnItem.weight + ' pounds', true);
                                                embed.addField('Item Worth', '$' + (game.returnItem.fish.price_per_pound * game.returnItem.weight).toFixed(2));

                                                let image = new Discord.MessageAttachment(game.returnItem.fish.image_url);

                                                let imageName = game.returnItem.fish.image_url.split('/fish/')[1];
                                                embed.setImage(`attachment://${imageName}`);

                                                sql.minigames.inventory.give(message, game.returnItem, 1)
                                                    .then(r => {
                                                        message.channel.send(`${message.author.toString()} You caught a ${game.returnItem.fish.item_name}`);

                                                        sql.minigames.exp(message, message.author.id, 1)
                                                            .then(val => {
                                                                sql.minigames.fishing.exp(message, message.author.id, Math.floor(1.5 * game.returnItem.weight))
                                                                    .then(f_val => {
                                                                        embed.addField('Experience earned', Math.floor(game.returnItem.weight));

                                                                        if (f_val.change)
                                                                            embed.addField('You leveled up in fishing!', `Level: ${f_val.level}\nExp: ${f_val.exp} / ${f_val.val}`);
                                                                        if (val.change)
                                                                            embed.addField('You leveled up in stats!', `Level: ${val.level}\nExp: ${val.exp} / ${val.val}`);

                                                                        sql.minigames.fishing.catchFish(message, message.author.id)
                                                                            .then(r => resolve({
                                                                                value: {
                                                                                    files: [image],
                                                                                    embed
                                                                                }
                                                                            }))
                                                                            .catch(e => reject(e));
                                                                    })

                                                            })
                                                            .catch(e => reject(e));
                                                    })
                                                    .catch(e => reject(e));
                                            }
                                        } else {
                                            resolve({
                                                value: '(WIP) Nothing was caught.\n In the future, there will be items available to catch and more fish.\n I am too lazy to deal with MySQL entries right now.'
                                            });
                                        }
                                    }, game.delay * 3000);
                                })
                                .catch(e => reject(e));
                        })
                        .catch(e => reject(e));
                } else {
                    resolve(`You're already fishing!`);
                }
            })
            .catch(e => reject(e));
    });
}