const chatFormat = require('../../../common/bot/helpers/global/chatFormat');
const getVC = require('../../../common/bot/helpers/global/getVoiceChannel');

module.exports = function (message) {
    return new Promise((resolve, reject) => {
        const vc = getVC(message);
        if (!vc)
            resolve(chatFormat.response.music.join.no_vc());
        else
            vc.join()
                .then(r => resolve(r))
                .catch(e => {
                    console.log(e);
                    reject(chatFormat.response.music.join.join_error())
                });
    });
}