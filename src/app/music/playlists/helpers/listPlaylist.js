const divideArray = require('../../../common/bot/helpers/divideArray');
const paths = require('../../../common/bot/helpers/paths');
const readFile = require('../../../common/bot/helpers/readFile');

module.exports = async function (message, playlistName, includeLinks = false) {
    let obj;
    try {
        obj = await readFile(`${paths.getPlaylistPath(message)}${playlistName}.json`);
    }
    catch (e) {
        message.channel.send('There is nothing in the playlist.');
        return console.log(e);
    }

    if (obj.playlist.length == 0) {
        message.channel.send('There is nothing in the playlist.');
        return;
    }

    divideArray(obj.playlist, 25)
        .then(arrays => {
            let msg = '';
            let num = 0;
            for (let k = 0; k < arrays.length; k++) { // Array of subarrays.
                msg = '';
                for (let i = 0; i < arrays[k].length; i++) {
                    num = i + 1 + 25 * k;
                    if (!arrays[k][i])
                        continue;
                    msg += `${num}. ${arrays[k][i].title}${includeLinks ? `| ${arrays[k][i].url}` : ''}\n`;
                }
                if (msg != '')
                    message.channel.send(msg);
                else
                    message.channel.send('There are 0 songs in the provided playlist.')
            }
        })
        .catch(e => console.log(e));
}