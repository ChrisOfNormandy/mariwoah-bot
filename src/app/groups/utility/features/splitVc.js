const Discord = require('discord.js');
const { MessageData, Output, helpers } = require('@chrisofnormandy/mariwoah-bot');

const { shuffle, getVoiceChannel } = helpers;

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns {Promise<Output>}
 */
module.exports = (message, data) => {
    return new Promise((resolve, reject) => {
        let channel = getVoiceChannel(message);

        let name = channel.name;

        channel.join()
            .then(r => {
                let vcList = r.channel.guild.channels.cache.filter((v) => {
                    return v.type === 'voice' && (v.name === name || data.arguments.includes(v.name));
                }).array();

                shuffle(
                    channel.members.filter((v) => {
                        return v.user.id !== data.client.user.id;
                    })
                        .array()
                )
                    .then(list => {
                        let i = Math.floor(list.length / vcList.length);
                        let count = 0;

                        list.forEach(user => {

                            if (count < i)
                                user.voice.setChannel(vcList[0]);
                            else
                                user.voice.setChannel(vcList[1]);

                            count++;
                        });

                        channel.leave();

                        resolve(new Output('Shuffled and divided users.'));
                    })
                    .catch(err => reject(new Output().setError(err)));
            })
            .catch(err => reject(new Output().setError(err)));
    });
};