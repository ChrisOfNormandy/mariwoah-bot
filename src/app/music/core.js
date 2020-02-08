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
    play: function(message) {music.play(message)},
    join: function(message) {music.join(message)},
    leave: function(message) {music.leave(message)},
    skip: function(message) {music.skip(message)},
    stop: function(message) {music.stop(message)},
    listQueue: function(message) {music.listQueue(message)},

    playPlaylist: function(message) {playlist.play(message)},
    listPlaylist: function(message) {playlist.list(message)},
    listAllPlaylists: function(message) {playlist.listAll(message)},
    createPlaylist: function(message) {playlist.create(message)},
    addToPlaylist: function(message) {playlist.add(message)},
    removeFromPlaylist: function(message) {playlist.remove(message)},

    playlistCommand: async function(message, commandList) {
        return new Promise(async function(resolve, reject) {
            if (commandList[0] == 'play')
                verify(message, pl.play.permissionLevel)
                .then(() => resolve(this.playPlaylist(message)))
                .catch(r => reject(r));
            else if (commandList[0] == 'list')
                verify(message, pl.list.permissionLevel)
                .then(() => resolve((commandList.length == 1) ? this.listAllPlaylists(message) : this.listPlaylist(message)))
                .catch(r => reject(r));
            else if (commandList[0] == 'create')
                verify(message, pl.create.permissionLevel)
                .then(() => resolve(this.createPlaylist(message)))
                .catch(r => reject(r));
            else if (commandList[0] == 'add')
                verify(message, pl.add.permissionLevel)
                .then(() => resolve(this.addToPlaylist(message)))
                .catch(r => reject(r));
            else if (commandList[0] == 'remove')
                verify(message, pl.remove.permissionLevel)
                .then(() => resolve(this.removeFromPlaylist(message)))
                .catch(r => reject(r));
            else reject(null);
        });
    }
}