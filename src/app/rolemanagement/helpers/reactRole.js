const Discord = require('discord.js');
const commandFormat = require('../../common/bot/helpers/global/commandFormat');
const chatFormat = require('../../common/bot/helpers/global/chatFormat');
const setRoles = require('./setRoles');

const icons = [
    "🟥",
    "🟧",
    "🟨",
    "🟩",
    "🟦",
    "🟪",
    "⬜",
    "⬛",
    "🟫"
];

function createEmbed(message, data) {
    return new Promise((resolve, reject) => {
        if (!data.mentions.roles.size)
            return null;

        let embed = new Discord.MessageEmbed()
            .setTitle('Role Reactions')
            .setColor(chatFormat.colors.byName.purple)
            .addField('React to this message with the following:', '_Reactions are removed automatically._\n_Reacting again will remove the role._');

        let count = 0;
        let str = '';
        data.mentions.roles.forEach((role, id, map) => {
            if (count < 9) {
                str += `${icons[count]} - ${role}`;
                count++;
            }
            if (count < 8 || count < map.size)
                str += '\n';
        });

        embed.addField('Roles:', str);

        message.channel.send(embed)
            .then(msg => {
                
            })
    });
}

function onEvent(reaction, user) {
    return new Promise((resolve, reject) => {
        if (reaction.message.embeds.length && reaction.message.embeds[0].title == 'Role Reactions') {
            let lines = reaction.message.embeds[0].fields[1].value.split('\n');
            console.log(lines);
            for (let i in lines) {
                let line = lines[i].split(' - ');
                if (line[0] == reaction._emoji.name) {
                    let roleID = line[1].match(/\d{18}/g)[0];
                    if (!user.roles.cache.has(roleID))
                        setRoles.add(reaction.message, user.id, roleID)
                            .then(() => {
                                reaction.remove();
                                resolve(true);
                            })
                            .catch(e => reject(e));
                    else
                        setRoles.remove(reaction.message, user.id, roleID)
                            .then(() => {
                                reaction.remove();
                                resolve(true);
                            })
                            .catch(e => reject(e));
                }
            }
        }
        else {
            reaction.remove();
            resolve(null);
        }
    });
}

module.exports = {
    send: (message, data) => {
        createEmbed(message, data);
        return commandFormat.valid([], []);
    },
    onEvent
}