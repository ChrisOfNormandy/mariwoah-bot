const divideArray = require('../../main/bot/helpers/divideArray');
const global = require('../../main/global');

module.exports = async function (obj, message, includeLinks) {
    divideArray(obj.playlist, 25)
    .then(arrays => {
        for (let k = 0; k < arrays.length; k++) {
            msg = '';
            for (let i = 0; i < obj.playlist.length; i++) {
                if (!arrays[k][i]) continue;
                if (includeLinks) {
                    msg += `${k * 25 + i + 1}. ${arrays[k][i].title} | ${arrays[k][i].url}\n`;
                }
                else {
                    msg += `${k * 25 + i + 1}. ${arrays[k][i].title}\n`;
                }
            }
            message.channel.send(msg);
        }
    })
    .catch(e => {
        global.log('Exception thrown from music helper listPlaylist -> divideArray promise - caught.', 'error');
        global.log(`Rejected to - ${e}`);
    })
}