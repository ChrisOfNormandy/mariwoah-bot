const { chatFormat, output } = require('../../../../helpers/commands');
const getVC = require('../../../../helpers/getVoiceChannel');

module.exports = (message) => {
    return new Promise((resolve, reject) => {
        const vc = getVC(message);
        if (!vc)
            resolve(chatFormat.response.music.join.no_vc());
        else
            vc.join()
                .then(r => resolve(output.valid([r], [])))
                .catch(e => reject([e], [chatFormat.response.music.join.join_error()]));
    });
};