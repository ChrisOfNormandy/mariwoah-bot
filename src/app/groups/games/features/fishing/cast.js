const Discord = require('discord.js');
const { chatFormat, output } = require('../../../../helpers/commands');
const loot_table = require('./loot_table.json');

const playerdata = require('../../../../helpers/playerdata');
const item = require('../inventory/item');

// -- Price per pound >> Rarity
// -- 0: < 0.5
// -- 1: < 1.5
// -- 2: < 3.5
// -- 3: < 5
// -- 4: > 5

module.exports = (userID) => {
    let cast = Math.floor(Math.random() * 5);

    let fish = null, embed;

    return new Promise((resolve, reject) => {
        if (Math.floor(Math.random() * 100) % 2 == 0) {
            let list = loot_table.list.filter((fish) => {
                return fish.rarity <= cast;
            });

            let rng = Math.floor(list.length * Math.random());

            fish = list[rng];
            let weight = Number(Math.pow(10, (-1 * fish.intercept) + fish.slope * Math.log10(fish.length)).toFixed(2));
            
            let fishItem = item.create(fish.name, fish.rarity, Number((weight * fish.price_per_pound).toFixed(2)), `A ${fish.length}" ${chatFormat.capFormat(fish.name)} weighing ${weight} pounds.`);
            let exp = (Math.floor(fishItem.price) + 1) * (fish.rarity + 1);

            playerdata.data.inventory.give(userID, fishItem, 'fish', 1)
                .then(user => {
                    playerdata.data.experience.add(userID, 'fishing', exp)
                        .then(user => {
                            embed = new Discord.MessageEmbed()
                                .setTitle('Well found!')
                                .setColor(chatFormat.colors.byName.blue)
                                .addField('You caught a fish!', chatFormat.capFormat(fishItem.name))
                                .addField('Description:', fishItem.description)
                                .addField('Price per pound:', `${fish.price_per_pound} U.`)
                                .setFooter(`XP earned: ${exp}`);

                            resolve(output.valid([fish], [embed]));
                        })
                        .catch(err => reject(output.error([err], [err.message])));
                })
                .catch(err => reject(output.error([err], [err.message])));
        }
        else {
            embed = new Discord.MessageEmbed()
                .setTitle('Bad luck...')
                .setColor(chatFormat.colors.byName.blue)
                .addField(`You didn't catch anything.`, 'Better luck next time!');

            resolve(output.valid([fish], [embed]));
        }
    });
}