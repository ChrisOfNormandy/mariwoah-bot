const Discord = require('discord.js');

module.exports = {
    single: function (title, activeQueue, index) {
        return new Promise(function (resolve, reject) {
            const song = activeQueue.songs[index];
            let embedMsg = new Discord.RichEmbed()
                .setTitle(title)
                .setThumbnail(song.thumbnail.url)
                .setURL(song.url)
                .addField(song.title, `${song.author} | Requested: ${song.requested.username}`)
                .addField(`Duration: ${song.durationString}`, `Queue position: ${index}`);

            resolve(embedMsg);
        });
    },
    queueList: function (activeQueue) {
        return new Promise(function (resolve, reject) {
            const song = activeQueue.songs[0];

            let embedMsg = new Discord.RichEmbed()
                .setTitle('Current song queue')
                .setColor('#990011')

                .setThumbnail(song.thumbnail.url)
                .setURL(song.url)
                .addField(`Now playing: ${song.title}`, song.author)
                .addField(`Duration: ${song.durationString}`, `Requested: ${song.requested.username}`);

                if (activeQueue.previousSong) {
                    embedMsg.addBlankField();
                    embedMsg.addField(`Previous: ${activeQueue.previousSong.title}`, activeQueue.previousSong.url);
                }

                embedMsg.addBlankField();

                if (activeQueue.songs.length > 1)
                    for (let i = 1; i < activeQueue.songs.length - 1; i++) {
                        embedMsg.addField(`${(activeQueue.songs[i].removed) ? `x${i}x` : i}. ${activeQueue.songs[i].title}`,
                            `Requested: \`\`${activeQueue.songs[i].requested.username}\`\``);
                    }
                else
                    embedMsg.setFooter(`Use "~play" or "~playlist play" to add more songs!`);

                resolve(embedMsg);
        });
    }
}