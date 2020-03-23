const getVC = require('../../../common/bot/helpers/global/getVoiceChannel');

module.exports = function (message) {
    const vc = getVC(message);
    if (!vc) {
        message.channel.send("You're not in a voice channel, dummy...");
        return;
    }
    else {
        vc.join()
            .then(connection => console.log('Success! - ' + connection))
            .catch(e => console.log(e));
    }
}