const fs = require('fs');
const paths = require('../../../common/bot/helpers/paths');

module.exports = function (message, playlistName) {
    try {
        if (!fs.existsSync(paths.getPlaylistPath(message)))
            fs.mkdirSync(paths.getPlaylistPath(message));

        fs.access(path, fs.F_OK, (err) => {
            if (err) {
                fs.open(`${paths.getPlaylistPath(message)}${playlistName}.json`, 'w', function (err) { if (err) return console.log(err); });
                message.channel.send('Created playlist with name ' + playlistName + '.');
                return;
            }
            message.channel.send('Playlist with name ' + playlistName + ' already exists!');
        });
    }
    catch (e) {
        console.log(e);
    }
}