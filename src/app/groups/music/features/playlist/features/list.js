const {chatFormat, output} = require('../../../../../helpers/commands');
const Discord = require('discord.js');
const { s3 } = require('../../../../../../aws/helpers/adapter');

function getList(guild_id) {
    return new Promise((resolve, reject) => {
        s3.object.list('mariwoah', `guilds/${guild_id}/playlists`)
            .then(list => resolve(list))
            .catch(err => reject(err));
    });
}

function byName(guild_id, name) {
    return new Promise((resolve, reject) => {
        getList(guild_id)
            .then(list => {
                const l = list.filter((file) => { return file.Key == `guilds/${guild_id}/playlists/${name}.json` });

                let embed = new Discord.MessageEmbed()
                    .setTitle(`Songs in the playlist: ${name}`)
                    .setColor(chatFormat.colors.information);

                if (!l.length) {
                    embed.addField(`Nothing found.`, `You can add songs using:\n> playlist add ${name} {song title / youtube url(s)}`);
                    resolve(output.valid(l, [embed]));
                }
                else {
                    s3.object.get('mariwoah', `guilds/${guild_id}/playlists/${name}.json`)
                        .then(obj => {
                            let list = JSON.parse(obj.Body.toString());

                            let index = 1;
                            for (let s in list) {
                                const song = list[s];
                                embed.addField(`${index}. ${song.title}`, `${song.author} | Duration: ${song.duration.timestamp}\n${song.url}`);
                                index++;
                            }

                            resolve(output.valid([list], [embed]));
                        })
                        .catch(err => reject(output.error([err], [err.message])));
                }
            })
            .catch(err => reject(output.error([err], [err.message])));
    });
}

function all(guild_id) {
    return new Promise((resolve, reject) => {
        getList(guild_id)
            .then(list => {
                const path = require('path');
                let embed = new Discord.MessageEmbed()
                    .setTitle(`Available Playlists`)
                    .setColor(chatFormat.colors.information);

                let i = 0;
                list.forEach((file) => {
                    let index = i + 1;
                    embed.addField(`${index}. ${path.basename(file.Key).replace('.json', '')}`, `<Details will go here :)>`);
                    i++;
                });

                resolve(output.valid([list], [embed]));
            })
            .catch(err => reject(output.error([err], ["Bad list."])));
    });
}

module.exports = (guild_id, name = null) => {
    if (!name)
        return all(guild_id);
    return byName(guild_id, name);
}