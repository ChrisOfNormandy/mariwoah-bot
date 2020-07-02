const chatFormat = require('../../../../common/bot/helpers/global/chatFormat');
const db = require('../../../../sql/adapter');
const instance = require('./instance');
const Discord = require('discord.js');

const assetPath = 'src/app/common/assets/items/fish/'

module.exports = function (message, userID) {
    return new Promise((resolve, reject) => {
        db.minigames.fishing.get(message, userID)
            .then(user => {
                if (!instance.get(user)) {
                    instance.set(user)
                        .then(game => {
                            message.channel.send(`Casting. You will be pinged when you catch something!`)
                                .then(msg => {
                                    setTimeout(() => {
                                        if (game.returnItem !== null) {
                                            let embed = new Discord.MessageEmbed();
                                            if (game.returnItem.fish) {
                                                db.minigames.inventory.give(message, game.returnItem, 1)
                                                    .then(r => {
                                                        message.channel.send(`${message.author.toString()} You caught a ${game.returnItem.fish.item_name}`);
                                                        embed.setTitle(game.returnItem.fish.item_name);
                                                        embed.setColor(chatFormat.colors.byName.cyan);
                                                        embed.addField('Size', game.returnItem.size + ' inches', true);
                                                        embed.addField('Weight', game.returnItem.weight + ' pounds', true);
                                                        embed.addField('Item Worth', '$' + (game.returnItem.fish.price_per_pound * game.returnItem.weight).toFixed(2));
                                                        let image = new Discord.MessageAttachment(assetPath + game.returnItem.fish.image_url);
                                                        embed.setImage(`attachment://${game.returnItem.fish.image_url}`);

                                                        instance.remove(user);

                                                        db.minigames.exp(message, message.author.id, 1)
                                                            .then(val => {
                                                                db.minigames.fishing.exp(message, message.author.id, Math.floor(1.5 * game.returnItem.weight))
                                                                    .then(f_val => {
                                                                        embed.addField('Experience earned', Math.floor(game.returnItem.weight));
                                                                        if (f_val.change)
                                                                            embed.addField('You leveled up in fishing!', `Level: ${f_val.level}\nExp: ${f_val.exp} / ${f_val.val}`);
                                                                        if (val.change)
                                                                            embed.addField('You leveled up in stats!', `Level: ${val.level}\nExp: ${val.exp} / ${val.val}`);

                                                                        db.minigames.fishing.catchFish(message, message.author.id)
                                                                            .then(r => resolve({value: { files: [image], embed }}))
                                                                            .catch(e => reject(e));
                                                                    })

                                                            })
                                                            .catch(e => reject(e));
                                                    })
                                                    .catch(e => reject(e));
                                            }
                                        }
                                        else {
                                            instance.remove(user);
                                            resolve({value: '(WIP) Nothing was caught.\n In the future, there will be items available to catch and more fish.\n I am too lazy to deal with MySQL entries right now.'});
                                        }
                                        msg.delete();
                                    }, game.delay * 3000);
                                })
                                .catch(e => reject(e));
                        })
                        .catch(e => reject(e));
                }
                else {
                    resolve(`You're already fishing!`);
                }
            })
            .catch(e => reject(e));
    });
}