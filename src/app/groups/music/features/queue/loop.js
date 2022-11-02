const queue = require('./queue');

const { MessageEmbed } = require('discord.js');
const { handlers, Output } = require('@chrisofnormandy/mariwoah-bot');

const { voiceChannel } = handlers.channels;

/**
 *
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
 * @returns
 */
function loop(data) {
    const vc = voiceChannel.get(data.message);

    if (!vc)
        return new Output().makeError('No voice channel.').reject();

    const q = queue.get(data.message.guild.id);

    if (!q || !q.status())
        return new Output().makeError('No active queue.').reject();

    q.current().next = q.current();

    const embed = new MessageEmbed()
        .makeField('Queue Changed', `Looping ${q.current().title}.`);

    return new Output().addEmbed(embed).resolve();
}

module.exports = loop;