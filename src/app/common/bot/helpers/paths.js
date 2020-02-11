module.exports = {
    stats: './src/app/minigames/stats.json',
    serverFiles: './src/app/common/roleManager/servers/',
    dungeonList: './src/app/common/assets/dungeons_equipment_list.csv',
    getPlaylistPath: function(message) {return `${this.serverFiles}server_${message.channel.guild.id}/playlists/`;},
    getRoleManagerServerPath: function(message) {return `${this.serverFiles}server_${message.channel.guild.id}/`;}
}