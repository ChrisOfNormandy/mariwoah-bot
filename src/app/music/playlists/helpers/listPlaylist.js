const chatFormats = require('../../../common/bot/helpers/chatFormats');
const Discord = require('discord.js');
const divideArray = require('../../../common/bot/helpers/divideArray');
const paths = require('../../../common/bot/helpers/paths');
const readFile = require('../../../common/bot/helpers/readFile');

module.exports = async function (message, playlistName, pageNumber = 0, includeLinks = false) {
    let obj;
    try {
        obj = await readFile(`${paths.getPlaylistPath(message)}${playlistName}.json`);
    }
    catch (e) {
        message.channel.send('There is nothing in the playlist.');
        return console.log(e);
    }

    if (!obj.playlist.length) {
        message.channel.send('There is nothing in the playlist.');
        return;
    }

    divideArray(obj.playlist, 25)
        .then(arrays => {
            let msg = '';
            let num = 0;
            let embedMsg = new Discord.RichEmbed()
                .setTitle(`Songs in ${playlistName}`)
                .setColor(chatFormats.colors.information);

            if (pageNumber > arrays.length)
                pageNumber = arrays.length - 1
            else if (pageNumber < 1)
                pageNumber = 1;
            pageNumber--;

            for (let i = 0; i < arrays[pageNumber].length; i++) {
                num = i + 1 + 25 * pageNumber;
                if (!arrays[pageNumber][i])
                    continue;
                msg += `${num}. ${arrays[pageNumber][i].title}${includeLinks ? `| ${arrays[pageNumber][i].url}` : ''}\n`;
            }
            if (msg != '') {
                embedMsg.addField(`Page ${pageNumber + 1} of ${arrays.length}`, msg);
                message.channel.send(embedMsg);
            }
            else
                message.channel.send('There are 0 songs in the provided playlist.')
        })
        .catch(e => console.log(e));
}