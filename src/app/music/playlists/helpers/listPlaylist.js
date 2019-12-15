const divideArray = require('../../../common/bot/helpers/divideArray');
const readFile = require('../../../common/bot/helpers/readFile');
const paths = require('../../../common/bot/helpers/paths');

module.exports = async function (message) {
    let msgArray = message.content.split(' ');
    if (msgArray.length < 3) return;

    let playlistName = msgArray[2];
    let includeLinks = msgArray[3] == '-l'
    let msg = '';
    let obj;
    try { obj = await readFile(`${paths.playlists}${playlistName}.json`);}
    catch (e) {return console.log(e)}

    if (obj.playlist.length == 0) {
        message.channel.send('There is nothing in the playlist.');
        return;
    }

    divideArray(obj.playlist, 25)
    .then(arrays => {
        console.log(arrays);
        for (let k = 0; k < arrays.length; k++) {
            msg = '';
            for (let i = 0; i < obj.playlist.length; i++) {
                if (!arrays[k][i]) continue;
                msg += `${k * 25 + i + 1}. ${arrays[k][i].title}${includeLinks ? `| ${arrays[k][i].url}` : ''}\n`;
            }
            message.channel.send(msg);
        }
    })
    .catch(e => console.log(e));
}