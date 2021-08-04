const Discord = require('discord.js');
const path = require('path');

const { MessageData, Output, chatFormat } = require('@chrisofnormandy/mariwoah-bot');
const { s3 } = require('../../../../../helpers/aws');

/**
 * 
 * @param {string} guild_id 
 * @returns {Promise<AWS.S3.ObjectList>}
 */
function getList(guild_id) {
    return new Promise((resolve, reject) => {
        s3.object.list('mariwoah', `guilds/${guild_id}/playlists`)
            .then(list => resolve(list))
            .catch(err => reject(err));
    });
}

/**
 * 
 * @param {string} guild_id 
 * @param {string} name 
 * @returns {Promise<Output>}
 */
function byName(guild_id, name) {
    return new Promise((resolve, reject) => {
        getList(guild_id)
            .then(list => {
                const l = list.filter((file) => { return file.Key == `guilds/${guild_id}/playlists/${name}.json`; });

                let embed = new Discord.MessageEmbed()
                    .setTitle(`Songs in the playlist: ${name}`)
                    .setColor(chatFormat.colors.information);

                if (!l.length) {
                    embed.addField(`Nothing found.`, `You can add songs using:\n> playlist add ${name} {song title / youtube url(s)}`);
                    resolve(new Output({embed}).setValues(l));
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

                            resolve(new Output({embed}).setValues(list));
                        })
                        .catch(err => reject(new Output().setError(err)));
                }
            })
            .catch(err => reject(new Output().setError(err)));
    });
}

/**
 * 
 * @param {string} guild_id 
 * @returns {Promise<Output>}
 */
function all(guild_id) {
    return new Promise((resolve, reject) => {
        getList(guild_id)
            .then(list => {
                let embed = new Discord.MessageEmbed()
                    .setTitle(`Available Playlists`)
                    .setColor(chatFormat.colors.information);

                let i = 0;
                list.forEach((file) => {
                    let index = i + 1;
                    embed.addField(`${index}. ${path.basename(file.Key).replace('.json', '')}`, `<Details will go here :)>`);
                    i++;
                });

                resolve(new Output({embed}).setValues(list));
            })
            .catch(err => reject(new Output().setError(err)));
    });
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns {Promise<Output>}
 */
module.exports = (message, data) => {
    return (data.arguments[0])
        ? byName(message.guild.id, data.arguments[0])
        : all(message.guild.id);
};