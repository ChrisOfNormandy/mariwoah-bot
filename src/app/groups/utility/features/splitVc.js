const { Output, handlers } = require('@chrisofnormandy/mariwoah-bot');

const { shuffle } = handlers.arrays;
const { voiceChannel } = handlers.channels;

/**
 *
 * @param {import('@chrisofnormandy/mariwoah-bot').MessageData} data
 * @returns {Promise<Output>}
 */
module.exports = (data) => {
    return new Promise((resolve, reject) => {
        const vc = voiceChannel.get(data.message);

        let name = vc.name;

        voiceChannel.join(data.message, vc.id)
            .then((r) => {
                let vcList = r.channel.guild.channels.cache.filter((v) => {
                    return v.type === 'voice' && (v.name === name || data.arguments.includes(v.name));
                }).array();

                shuffle(Array.from(vc.members).filter((v) => v.user.id !== data.client.user.id))
                    .then((list) => {
                        let i = Math.floor(list.length / vcList.length);
                        let count = 0;

                        list.forEach((user) => {
                            if (count < i)
                                user.voice.setChannel(vcList[0]);
                            else
                                user.voice.setChannel(vcList[1]);

                            count++;
                        });

                        voiceChannel.leave(data.message);

                        new Output('Shuffled and divided users.').resolve(resolve);
                    })
                    .catch((err) => new Output().setError(err).reject(reject));
            })
            .catch((err) => new Output().setError(err).reject(reject));
    });
};