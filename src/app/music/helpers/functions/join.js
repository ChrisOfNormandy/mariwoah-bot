const getVC = require('../../../common/bot/helpers/global/getVoiceChannel');

module.exports = function (message) {
    return new Promise((resolve, reject) => {
        const vc = getVC(message);
        if (!vc) 
            resolve(`You're not in a voice channel, dummy...`);
        else
            vc.join()
                .catch(e => {
                    console.log(e);
                    resolve('Failed to join voice channel.')
                });
            });
}