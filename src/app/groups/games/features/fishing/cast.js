const Discord = require('discord.js');
const { Output, chatFormat } = require('@chrisofnormandy/mariwoah-bot');

const loot_table = require('./loot_table.json');
const playerdata = require('../players/playerdata');
const item = require('../inventory/item');

// -- Price per pound >> Rarity
// -- 0: < 0.5
// -- 1: < 1.5
// -- 2: < 3.5
// -- 3: < 5
// -- 4: > 5

const chances = {
    trash: {
        boost: 0,
        base: 0.2
    },
    fish: {
        boost: 0.02,
        base: 0.1,
        rarity: {
            0: 51,
            1: 26,
            2: 13,
            3: 7,
            4: 3
        }
    },
    treasure: {
        boost: 0.005,
        base: 0.05
    }
};

function getCastChance(skill) {
    let base = 0;
    let chance = {};

    for (let i in chances) {
        chance[i] = chances[i].base + base;
        base += chances[i].base;
    }

    let rng = Math.random();

    if (rng > base)
        return null;

    for (let i in chance) {
        if (rng < chance[i] + chances[i].boost * skill)
            return i;
    }
}

function getCatch(c, skill) {
    if (c === null)
        return null;

    switch (c) {
        case 'fish': {
            let i = 4;
            let base = 0;
            let chance = {};

            while (i >= 0) {
                chance[i] = chances.fish.rarity[i] + base + ((skill * 0.1 * i) / 4);
                base += chances.fish.rarity[i];
            }
        }
    }
}

module.exports = (userID) => {
    const cast = Math.floor(Math.random() * 5);

    let fish = null, embed;

    return new Promise((resolve, reject) => {
        playerdata.profile.get(userID)
            .then(profile => {
                let caught = getCastChance(playerdata.skill.calculate(profile.skills.fishing.score));

                // if (Math.floor(Math.random() * 100) % 2 == 0) {
                //     const list = loot_table.list.filter((fish) => { return fish.rarity <= cast; });

                //     const rng = Math.floor(list.length * Math.random());

                //     fish = list[rng];

                //     const weight = Number(Math.pow(10, (-1 * fish.intercept) + fish.slope * Math.log10(fish.length)).toFixed(2));

                //     const fishItem = item.create(fish.name, fish.rarity, Number((weight * fish.price_per_pound).toFixed(2)), `A ${fish.length}" ${chatFormat.capFormat(fish.name)} weighing ${weight} pounds.`);

                //     const exp = (Math.floor(fishItem.price) + 1) * (fish.rarity + 1);

                //     playerdata.data.inventory.give(userID, fishItem, 'fish', 1)
                //         .then(() => {
                //             playerdata.data.experience.add(userID, 'fishing', exp)
                //                 .then(() => {
                //                     embed = new Discord.MessageEmbed()
                //                         .setTitle('Well found!')
                //                         .setColor(chatFormat.colors.byName.blue)
                //                         .addField('You caught a fish!', chatFormat.capFormat(fishItem.name))
                //                         .addField('Description:', fishItem.description)
                //                         .addField('Price per pound:', `${fish.price_per_pound} U.`)
                //                         .setFooter(`XP earned: ${exp}`);

                //                     resolve(Output.valid([fish], [embed]));
                //                 })
                //                 .catch(err => reject(Output.error([err], [err.message])));
                //         })
                //         .catch(err => reject(Output.error([err], [err.message])));
                // }
                // else {
                //     embed = new Discord.MessageEmbed()
                //         .setTitle('Bad luck...')
                //         .setColor(chatFormat.colors.byName.blue)
                //         .addField(`You didn't catch anything.`, 'Better luck next time!');

                //     resolve(Output.valid([fish], [embed]));
                // }

                resolve(new Output('Yes.').setValues(profile));
            })
            .catch(err => reject(new Output().setError(err)));
    });
};