const commandList = require('../common/bot/helpers/global/commandList');
const music = require('./general/adapter');
const playlist = require('./playlists/adapter');
const roleManager = require('../common/roleManager/adapter');

async function verify(message, permissionLevel) {
    return new Promise(async function(resolve, reject) {
        if (message.member.hasPermission("ADMINISTRATOR"))
            resolve(true);

        roleManager.verifyPermission(message, message.author.id, permissionLevel)
        .then(verification => {
            if (!verification.status) {
                if (verification.reason)
                    message.channel.send(verification.reason);
                else
                    message.channel.send('Operation rejected by permission verification.')
                reject(false);
            }
            resolve(true);
        })
        .catch(e => reject(e));
    })
    
}

const pl = commandList.playlist.commands;

module.exports = {
    join: function (message) { music.join(message) },
    leave: function (message) { music.leave(message) },
    listQueue: function (message) { music.listQueue(message) },
    play: function (message, songURL, songName, vc) { music.play(message, songURL, songName, vc) },
    songInfo: async function (message, songURL, songName) { music.songInfo(message, songURL, songName) },
    removeFromQueue: function (message, index) { music.removeFromQueue(message, index) },
    skip: function (message) { music.skip(message) },
    stop: function (message) { music.stop(message) },

    addToPlaylist: function (message, playlistName, songURL = null, songName = null) { playlist.add(message, playlistName, songURL, songName) },
    createPlaylist: function (message, playlistName) { playlist.create(message, playlistName) },
    deletePlaylist: function (message, playlistName) { playlist.delete(message, playlistName) },
    listAllPlaylists: function (message) { playlist.listAll(message) },
    listPlaylist: function (message, playlistName, includeLinks) { playlist.list(message, playlistName, includeLinks) },
    playPlaylist: function (message, playlistName, doShuffle) { playlist.play(message, playlistName, doShuffle) },
    removeFromPlaylist: function (message, playlistName, index) { playlist.remove(message, playlistName, index) },

    playlistCommand: function (message, args) {
        const _this = this;
        const command = args[0];

        return new Promise(function (resolve, reject) {
            if (command == 'play')
                verify(message, pl.play.permissionLevel)
                    .then(() => resolve(_this.playPlaylist(message, args[1], args[2] === '-s')))
                    .catch(r => reject(r));
            else if (command == 'list')
                verify(message, pl.list.permissionLevel)
                    .then(() => resolve((args.length == 1) ? _this.listAllPlaylists(message) : _this.listPlaylist(message, args[1], (!isNaN(args[2]) ? args[2] : 0), args[3] === '-l')))
                    .catch(r => reject(r));
            else if (command == 'create')
                verify(message, pl.create.permissionLevel)
                    .then(() => resolve(_this.createPlaylist(message, args[1])))
                    .catch(r => reject(r));
            else if (command == 'delete')
                verify(message, pl.delete.permissionLevel)
                    .then(() => resolve(_this.deletePlaylist(message, args[1])))
                    .catch(r => reject(r));
            else if (command == 'add')
                verify(message, pl.add.permissionLevel)
                    .then(() => {
                        if (!args.join(' ').includes('youtube.com/watch?'))
                            resolve(_this.addToPlaylist(message, args[1], null, args.slice(2).join(' ')));
                        else resolve(_this.addToPlaylist(message, args[1], args[2], null));
                    })
                    .catch(r => reject(r));
            else if (command == 'remove')
                verify(message, pl.remove.permissionLevel)
                    .then(() => resolve(_this.removeFromPlaylist(message, args[1], args[2])))
                    .catch(r => reject(r));
            else reject(null);
        });
    }
}