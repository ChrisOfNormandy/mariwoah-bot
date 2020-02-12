const divideArray = require('../../../common/bot/helpers/divideArray');
const readFile = require('../../../common/bot/helpers/readFile');
const paths = require('../../../common/bot/helpers/paths');

module.exports = async function (message, playlistName, includeLinks = false) {
    let obj;
    try { obj = await readFile(`${paths.getPlaylistPath(message)}${playlistName}.json`); }
    catch (e) { return console.log(e); }

    if (obj.playlist.length == 0) {
        message.channel.send('There is nothing in the playlist.');
        return;
    }

    divideArray(obj.playlist, 25)
    .then(arrays => {
        let msg = '';
        for (let k in arrays) {
            msg = '';
            for (let i in obj.playlist) {
                if (!arrays[k][i]) continue;
                msg += `${k * 25 + i + 1}. ${arrays[k][i].title}${includeLinks ? `| ${arrays[k][i].url}` : ''}\n`;
            }
            message.channel.send(msg);
        }
    })
    .catch(e => console.log(e));
}