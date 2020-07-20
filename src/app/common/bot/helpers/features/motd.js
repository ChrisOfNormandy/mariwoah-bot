const db = require('../../../../sql/adapter');
const Discord = require('discord.js')

function get(message) {
    db.server.getMotd(message.guild.id)
        .then(motd => {
            let embedMsg = new Discord.RichEmbed()
                .setTitle(message.guild.name);

            let arr = motd.split('|');

            let str = '';
            let title, line, link, linkText, adjustLine, splitLine;

            for (let i in arr) {
                str = arr[i].split('&t');
                title = str[0];
                line = str[1];

                if (line && line.includes('<l>')) {
                    linkText = line.split('<l>')[0];
                    link = line.split('<l>')[1];
                }

                adjustLine = '';
                if (line) {
                    splitLine = line.split('\\n');

                    for (let s in splitLine)
                        adjustLine += splitLine[s] + '\n';

                    embedMsg.addField(title, (link) ? linkText : adjustLine);
                }
                if (link)
                    embedMsg.setURL(link);
            }
            message.channel.send(embedMsg);
        })
        .catch(e => {
            console.log(e);
            message.channel.send('Check syntax for how to format the MOTD.');
        });
}

function set(message, string) {
    db.server.setMotd(message.guild.id, string);
    setTimeout(() => get(message), 1000);
}

module.exports = {
    get,
    set
}