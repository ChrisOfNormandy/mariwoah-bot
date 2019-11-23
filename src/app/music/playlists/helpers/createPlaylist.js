const fs = require('fs');

const global = require('../../../resources/core');

module.exports = function (message) {
    const args = message.content.split(' ');
    if (args.length < 3) return message.channel.send('Not enough arguments provided to create playlist.');

    try {
        const name = args[2];
        const path = `${global.playlistPath}${name}.json`;

        fs.access(path, fs.F_OK, (err) => {
            if (err) {
                console.log(err);
                console.log("MAKING THE FILE");
                fs.open(path, 'w', function (err, file) {
                    if (err) return;
                });
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