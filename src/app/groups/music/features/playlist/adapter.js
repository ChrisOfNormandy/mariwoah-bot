const { Output, handlers } = require('@chrisofnormandy/mariwoah-bot');
const { MessageEmbed } = handlers.embed;

const { errOuput } = handlers.error;

const addSong = require('./features/addSong');
const queue = require('../queue/queue');

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns {Promise<Output>}
 */
function _addSong(message, data) {
    return new Promise((resolve, reject) => {
        let playlistName = data.arguments[0];

        if (data.urls.length)
            resolve(addSong.byURLs(message, playlistName, data.urls));
        else {
            let songName = data.arguments[1];

            if (songName === 'this') {
                if (queue.has(message.guild.id)) {
                    addSong.bySong(message, playlistName, queue.get(message.guild.id).songs[0])
                        .then((song) => {
                            let embed = new MessageEmbed()
                                .setTitle(`${song.title}`)
                                .setColor(handlers.chat.colors.byName.green)
                                .makeThumbnail(song.thumbnail)
                                .setURL(song.url)
                                .makeField(':writing_hand: Success!', 'Added song to the playlist.');

                            new Output()
                                .addEmbed(embed)
                                .setValues(song)
                                .handleAsync(resolve);
                        })
                        .catch((err) => errOuput(err, reject));
                }
                else
                    errOuput(new Error('No queue.'), reject);
            }
            else {
                addSong.byName(message, playlistName, songName)
                    .then((song) => {
                        let embed = new MessageEmbed();

                        if (song) {
                            embed.setTitle(`${song.title}`)
                                .setColor(handlers.chat.colors.byName.green)
                                .makeThumbnail(song.thumbnail)
                                .setURL(song.url)
                                .makeField(':writing_hand: Success!', 'Added song to the playlist.');

                            new Output()
                                .setValues(song)
                                .addEmbed(embed)
                                .handleAsync(resolve);
                        }
                        else {
                            embed.setTitle('Error')
                                .setColor(handlers.chat.colors.byName.red)
                                .makeField(':interrobang: Oops!', 'Failed to add song to playlist.');

                            new Output()
                                .addEmbed(embed)
                                .handleAsync(resolve);
                        }
                    })
                    .catch((err) => errOuput(err, reject));
            }
        }
    });
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns {Promise<Output>}
 */
function _delete(message, data) {
    // Const { s3 } = require('../../../../../aws/helpers/adapter');
    return new Promise((resolve, reject) => {
        s3.object.delete('mariwoah', `guilds/${message.guild.id}/playlists/${data.arguments[0]}.json`)
            .then((res) => resolve(new Output('Deleted playlist.').setValues(res)))
            .catch((err) => reject(new Output().setError(err)));
    });
}

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns {Promise<Output>}
 */
function remove(message, data) {
    // Const { s3 } = require('../../../../../aws/helpers/adapter');
    return new Promise((resolve, reject) => {
        s3.object.get('mariwoah', `guilds/${message.guild.id}/playlists/${data.arguments[0]}.json`)
            .then((res) => {
                const pl = JSON.parse(res.Body.toString());

                for (let s in pl) {
                    const song = pl[s];

                    if (data.urls.length && data.urls.includes(song.url))
                        delete pl[s];
                    else if (data.arguments[1] === song.id)
                        delete pl[s];
                    else if (data.arguments[1] === song.title)
                        delete pl[s];
                    else if (data.arguments[1] === song.author)
                        delete pl[s];
                    // Else remove by requested user
                }

                s3.object.putData('mariwoah', `guilds/${message.guild.id}/playlists`, `${data.arguments[0]}.json`, JSON.stringify(pl))
                    .then(() => resolve(new Output('Wow.').setValues(res)))
                    .catch((err) => reject(new Output().setError(err)));
            })
            .catch((err) => reject(new Output().setError(err)));
    });
}

module.exports = {
    play: require('./features/play'),
    list: require('./features/list'),
    create: require('./features/create'),
    addSong: _addSong,
    delete: _delete,
    remove,
    setVisibility: require('./features/setVisibility')
};