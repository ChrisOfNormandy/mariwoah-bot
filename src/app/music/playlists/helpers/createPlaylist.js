const fs = require('fs');
const paths = require('../../../common/bot/helpers/paths');

module.exports = function (message) {
    const args = message.content.split(' ');
    if (args.length < 3) return message.channel.send('Not enough arguments provided to create playlist.');

    try {
        const name = args[2];

        if (!fs.existsSync(paths.getPlaylistPath(message))){
            fs.mkdirSync(paths.getPlaylistPath(message));
        }

        const path = `${paths.getPlaylistPath(message)}${name}.json`;
        console.log(path);
        fs.access(path, fs.F_OK, (err) => {
            if (err) {
                fs.open(path, 'w', function (err, file) {if (err) return;});
                message.channel.send('Created playlist with name ' + name + '.');
                return;
            }
            message.channel.send('Playlist with name ' + name + ' already exists!');
        })
    }
    catch (e) {
        console.log(e);
    }
}