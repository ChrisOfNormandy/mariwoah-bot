const queue = require('./map');
const getVC = require('../../../common/bot/helpers/global/getVoiceChannel');
const play = require('../functions/play');
const getEmbed = require('../getEmbedSongInfo');
const { ActivityFlags } = require('discord.js');

module.exports = function (message, song, arr = null, flags = {}) {
    return new Promise(async (resolve, reject) => {
        const voiceChannel = getVC(message);
        let startFlag = false;

        if (!voiceChannel)
            reject("No voice channel!");
        else {
            if (!queue.has(message.guild.id) || !queue.get(message.guild.id).active) {
                let activeQueue = {
                    textChannel: message.channel,
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
        
            if (arr !== null) {
                for (let i in arr) {
                    queue.get(message.guild.id).songs.push({song: arr[i], request: message.author});
                }
            }
            else {
                queue.get(message.guild.id).songs.push({song: song, request: message.author});
            }
        
            if (queue.get(message.guild.id).connection === null) {
                var connection = await voiceChannel.join();
                queue.get(message.guild.id).connection = connection;
            }
        
            if (!flags['n']) {
                if (arr === null) {
                    if (queue.get(message.guild.id).songs.length == 1) {
                        getEmbed.single('Now playing...', queue.get(message.guild.id), 0)
                            .then(msg => message.channel.send(msg))
                            .catch(e => reject(e));
                        resolve(play(message, queue.get(message.guild.id).songs[0]));
                    }
                    else {
                        getEmbed.single('Added to queue:', queue.get(message.guild.id), queue.get(message.guild.id).songs.length - 1)
                            .then(msg => message.channel.send(msg))
                            .catch(e => reject(e));
                    }
                }
                else {
                    let counter = 0;
                    if (startFlag) {
                        counter = 1;
                        getEmbed.single('Now playing...', queue.get(message.guild.id), 0)
                            .then(msg => message.channel.send(msg))
                            .catch(e => reject(e));
                    }
                    if (!flags['f'])
                        while (counter < arr.length) {
                            getEmbed.single('Added to queue:', queue.get(message.guild.id), counter)
                                .then(msg => message.channel.send(msg))
                                .catch(e => reject(e));
                            counter++;
                        }
                    resolve(play(message, queue.get(message.guild.id).songs[0]));
                }
            }
        }
    })
    

    

    
}