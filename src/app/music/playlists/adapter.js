const play = require('./helpers/playPlaylist');
const list = require('./helpers/listPlaylist');
const create = require('./helpers/createPlaylist');
const listDir = require('../../common/bot/helpers/listDir');
const paths = require('../../common/bot/helpers/paths');
const add = require('./helpers/addToPlaylist');
const remove = require('./helpers/removeFromPlaylist');

module.exports = {
    play: function(message) {play(message)},
    list: function(message) {list(message)},
    listAll: function(message) {
        listDir(paths.playlists)
        .then(list => {
            if (list.length == 0) {
                message.channel.send('There are no created playlists.');
                return;
            }
            let msg = '';
            for (let i = 0; i < list.length; i++)
                msg += `${i + 1}. ${list[i].split('.')[0]}\n`;
            message.channel.send(msg);
        })
        .catch(e => console.log(e));
    },
    create: function(message) {create(message)},
    add: async function(message) {
        let result = await add(message, paths.playlists);
        console.log((result) ? 'Added song successfully!' : 'Failed to add song!');
        message.channel.send((result) ? `Added song to the playlist!\n${message.content.split(' ')[3]}` : 'Failed to add song to playlist');
        message.delete();
    },
    remove: async function(message) {
        let result = await remove(message, paths.playlists);
        console.log((result) ? 'Removed song successfully!' : 'Failed to remove song!');
        message.channel.send((result) ? 'Removed song from the playlist!' : 'Failed to remove song from playlist');
        message.delete();
    }
}