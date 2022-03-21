const queue = require('./queue');

const { MessageEmbed } = require('discord.js');
const { handlers, Output } = require('@chrisofnormandy/mariwoah-bot');

const { voiceChannel } = handlers.channels;

module.exports = (message) => {
    const vc = voiceChannel.get(message);

    if (!vc)
        return Promise.reject(new Output().setError(new Error('No voice channel.')));

    if (!queue.exists(message.guild.id))
        return Promise.reject(new Output().setError('No active queue.'));

    const q = queue.get(message.guild.id);

    if (!q.songs.length)
        return Promise.reject(new Output().setError(new Error('No songs.')));

    q.current().next = q.current();

    const embed = new MessageEmbed()
        .addField('Queue Changed', `Looping ${q.current().title}.`);

    return Promise.resolve(new Output().addEmbed(embed));
};