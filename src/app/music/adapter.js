const commandList = require('../common/bot/helpers/global/commandList');
const playlist = require('./playlists/adapter');
const roleManager = require('../common/roleManager/adapter');

const getSong = require('./helpers/getSong');
const append = require('./helpers/queue/append');
const skip = require('./helpers/functions/skip');
const list = require('./helpers/queue/list');
const stop = require('./helpers/functions/stop');
const getVC = require('../common/bot/helpers/global/getVoiceChannel');

const pl = commandList.playlists.commands;

function verify(message, permissionLevel) {
    return new Promise((resolve, reject) =>  {
        roleManager.verifyPermission(message, message.author.id, permissionLevel)
            .then(r => resolve(r))
            .catch(e => reject(e));
    });
}

module.exports = {
    append: {
        byURL: (message, songURL) => {getSong.byURL(message, songURL).then(obj => append(message, obj)).catch(e => console.log(e))},
        byName: (message, songName) => {getSong.byName(message, songName).then(obj => append(message, obj)).catch(e => console.log(e))}
    },
    skip: (message) => {skip(message)},
    list: (message) => {list(message)},
    stop: (message) => {stop(message)},
    join: (message) => {
        const vc = getVC(message);
        if (vc)
            vc.join();
        else
            message.channel.send('> You must be in a voice channel to add bot.');
    },
    leave: (message) => {
        const vc = getVC(message);
        if (vc)
            vc.leave();
        else
            message.channel.send('> You must be in a voice channel to remove bot.')
    },

    pl_append: (message, playlistName, songURL = null, songName = null) => {playlist.append(message, playlistName, songURL, songName)},
    pl_create: (message, playlistName) => {playlist.create(message, playlistName)},
    pl_delete: (message, playlistName) => {playlist.delete(message, playlistName)},
    pl_listAll: (message) => {playlist.listAll(message)},
    pl_list: (message, playlistName) => {playlist.list(message, playlistName)},
    pl_remove: (message, playlistName, songURL) => {playlist.remove(message, playlistName, songURL)},
    pl_play: (message, playlistName, doShuffle = false) => {playlist.play(message, playlistName, doShuffle)},

    playlistCommand: function (message, args) {
        const _this = this;
        const command = args[0];

        return new Promise((resolve, reject) =>  {
            if (command == 'play')
                verify(message, pl.play.permissionLevel)
                    .then(() => resolve(_this.pl_play(message, args[1], args[2] === '-s')))
                    .catch(r => reject(r));
            else if (command == 'list')
                verify(message, pl.list.permissionLevel)
                    .then(() => resolve((args.length == 1)
                        ? _this.pl_listAll(message) 
                        : _this.pl_list(message, args[1])))
                    .catch(r => reject(r));
            else if (command == 'create')
                verify(message, pl.create.permissionLevel)
                    .then(() => resolve(_this.pl_create(message, args[1])))
                    .catch(r => reject(r));
            else if (command == 'delete')
                verify(message, pl.delete.permissionLevel)
                    .then(() => resolve(_this.pl_delete(message, args[1])))
                    .catch(r => reject(r));
            else if (command == 'add')
                verify(message, pl.add.permissionLevel)
                    .then(() => {
                        if (!args.join(' ').includes('youtube.com/watch?'))
                            resolve(_this.pl_append(message, args[1], null, args.slice(2).join(' ')));
                        else resolve(_this.pl_append(message, args[1], args[2], null));
                    })
                    .catch(r => reject(r));
            else if (command == 'remove')
                verify(message, pl.remove.permissionLevel)
                    .then(() => resolve(_this.pl_remove(message, args[1], args[2])))
                    .catch(r => reject(r));
            else reject(null);
        });
    }
}