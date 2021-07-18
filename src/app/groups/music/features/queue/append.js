const { chatFormat, output } = require('../../../../helpers/commands');
const shuffle = require('../../../../helpers/shuffle');
const queue = require('./map');
const getVC = require('../../../../helpers/getVoiceChannel');
const play = require('./play');
const getEmbed = require('../../helpers/getEmbedSongInfo');

function f(message, songs, flags, startFlag) {
    return new Promise((resolve, reject) => {
        for (let i in songs)
            queue.get(message.guild.id).songs.push(songs[i]);

        if (flags.n)
            resolve(output.valid([play(message, queue.get(message.guild.id).songs[0])], []));
        else {
            let fromPlaylist = !!queue.get(message.guild.id).songs[0].playlist.title;

            if (startFlag) {
                getEmbed.single('Now playing...', queue.get(message.guild.id), 0, fromPlaylist)
                    .then(embed => resolve(output.valid([play(message, queue.get(message.guild.id).songs[0])], [embed], { clear: queue.get(message.guild.id).songs[0].duration.seconds })))
                    .catch(e => reject(output.error([e], [])));
            }
            else {
                getEmbed.single('Added to queue:', queue.get(message.guild.id), queue.get(message.guild.id).songs.length - 1, fromPlaylist)
                    .then(embed => resolve(output.valid([queue.get(message.guild.id).songs], [embed])))
                    .catch(e => reject(output.error([e], [])));
            }
        }
    });
}

module.exports = (message, songs, flags = {}) => {
    return new Promise(async (resolve, reject) => {
        if (!songs.length)
            reject(output.error([], ['Tried to add 0 songs to the active queue.']));
        else {
            const voiceChannel = getVC(message);
            let startFlag = false;

            if (!voiceChannel)
                reject(output.error([], [chatFormat.response.music.no_vc()]));
            else {
                if (!queue.has(message.guild.id) || !queue.get(message.guild.id).active) {
                    let activeQueue = {
                        voiceChannel: voiceChannel,
                        connection: null,
                        songs: [],
                        volume: 5,
                        active: true,
                        previousSong: null,
                        dispatcher: null
                    };

                    queue.set(message.guild.id, activeQueue);
                    startFlag = true;
                }

                if (queue.get(message.guild.id).connection === null) {
                    var connection = await voiceChannel.join();
                    queue.get(message.guild.id).connection = connection;
                }

                if (!!flags.s)
                    shuffle(songs)
                        .then(songs => {
                            f(message, songs, flags, startFlag)
                                .then(res => resolve(res))
                                .catch(e => reject(e));
                        })
                        .catch(e => reject(output.error([e], [])));
                else
                    f(message, songs, flags, startFlag)
                        .then(res => resolve(res))
                        .catch(e => reject(e));
            }
        }
    });
};