const Discord = require('discord.js');
const getServerConfig = require('./getServerConfig');

module.exports = function(message) {
    getServerConfig(message)
    .then(config => {
        let embedMsg = new Discord.RichEmbed()
            .setTitle(message.channel.guild.name);

        let arr = config.motd.split('|');

        console.log(arr);
        let str = '';
        let title;
        let line;
        let link;
        let linkText;
        let adjustLine;
        let splitLine;

        for(i in arr) {
            str = arr[i].split('&t');
            title = str[0];
            line = str[1];

            if (line && line.includes('<l>')) {
                linkText = line.split('<l>')[0];
                link = line.split('<l>')[1];
            }

            adjustLine = '';
            splitLine = line.split('\\n');

            for (s in splitLine) {
                console.log(splitLine[s])
                adjustLine += splitLine[s] + '\n';
            }

            embedMsg.addField(title, (link) ? linkText : adjustLine);
            if (link) embedMsg.setURL(link);
        }
        message.channel.send(embedMsg);
    })
}