const music = require('./general/adapter');
const playlist = require('./playlists/adapter');
const roleManager = require('../common/roleManager/adapter');
const commandList = require('../common/bot/helpers/commandList');

async function verify(message, permissionLevel) {
    if (message.member.hasPermission("ADMINISTRATOR")) return true;

    let verification = await roleManager.verifyPermission(message, message.author.id, permissionLevel);
    if (!verification.status) {
        if (verification.reason) message.channel.send(verification.reason);   
        else message.channel.send('Operation rejected by permission verification.')
        return false;
    }
    return true;
}

const pl = commandList.playlist.commands;

module.exports = {
    play: function(message, songURL, vc) {music.play(message, songURL, vc)},
    join: function(message) {music.join(message)},
    leave: function(message) {music.leave(message)},
    skip: function(message) {music.skip(message)},
    stop: function(message) {music.stop(message)},
    listQueue: function(message) {music.listQueue(message)},

    playPlaylist: function(message, playlistName, doShuffle) {playlist.play(message, playlistName, doShuffle)},
    listPlaylist: function(message, playlistName, includeLinks) {playlist.list(message, playlistName, includeLinks)},
    listAllPlaylists: function(message) {playlist.listAll(message)},
    createPlaylist: function(message, playlistName) {playlist.create(message, playlistName)},
    addToPlaylist: function(message, playlistName, songURL) {playlist.add(message, playlistName, songURL)},
    removeFromPlaylist: function(message, playlistName, index) {playlist.remove(message, playlistName, index)},

    playlistCommand: async function(message, args) {
        const _this = this;
        const command = args[0];

        return new Promise(async function(resolve, reject) {
            if (command == 'play')
                verify(message, pl.play.permissionLevel)
                .then(() => resolve(_this.playPlaylist(message, args[1], args[2] === '-s')))
                .catch(r => reject(r));
            else if (command == 'list')
                verify(message, pl.list.permissionLevel)
                .then(() => resolve((args.length == 1) ? _this.listAllPlaylists(message) : _this.listPlaylist(message, args[1], args[2] === '-l')))
                .catch(r => reject(r));
            else if (command == 'create')
                verify(message, pl.create.permissionLevel)
                .then(() => resolve(_this.createPlaylist(message, args[1])))
                .catch(r => reject(r));
            else if (command == 'add')
                verify(message, pl.add.permissionLevel)
                .then(() => resolve(_this.addToPlaylist(message, args[1], args[2])))
                .catch(r => reject(r));
            else if (command == 'remove')
                verify(message, pl.remove.permissionLevel)
                .then(() => resolve(_this.removeFromPlaylist(message, args[1], args[2])))
                .catch(r => reject(r));
            else reject(null);
        });
    }
}