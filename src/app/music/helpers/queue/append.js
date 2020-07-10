const chatFormat = require('../../../common/bot/helpers/global/chatFormat');
const queue = require('./map');
const getVC = require('../../../common/bot/helpers/global/getVoiceChannel');
const play = require('../functions/play');
const getEmbed = require('../getEmbedSongInfo');

module.exports = function (message, songs, flags = {}) {
    return new Promise(async (resolve, reject) => {
        const voiceChannel = getVC(message);
        let startFlag = false;

        if (!voiceChannel)
            reject(chatFormat.response.music.no_vc());
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

            for (let i in songs)
                queue.get(message.guild.id).songs.push(songs[i]);

            if (flags['n']) {
                resolve({ value: null, result: play(message, queue.get(message.guild.id).songs[0]) });
            }
            else {
                let fromPlaylist = !!queue.get(message.guild.id).songs[0].playlist.title;
                
                if (startFlag) {
                    getEmbed.single('Now playing...', queue.get(message.guild.id), 0, fromPlaylist)
                        .then(embed => resolve(
                            {
                                embed,
                                result: play(message, queue.get(message.guild.id).songs[0]), options: { clear: queue.get(message.guild.id).songs[0].duration.seconds }
                            }
                        ))
                        .catch(e => reject(e));
                }
                else {
                    getEmbed.single('Added to queue:', queue.get(message.guild.id), queue.get(message.guild.id).songs.length - 1, fromPlaylist)
                        .then(embed => resolve({ embed, result: null }))
                        .catch(e => reject(e));
                }
            }
        }
    });
}