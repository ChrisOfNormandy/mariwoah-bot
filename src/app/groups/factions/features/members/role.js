const {Discord} = require('@chrisofnormandy/mariwoah-bot');
const {MessageData} = require('@chrisofnormandy/mariwoah-bot');

const cache = require('../cache');

/**
 * 
 * @param {Discord.Message} message 
 * @param {MessageData} data 
 * @returns {Promise<FactionMember>}
 */
function add(message, data) {
    return new Promise((resolve, reject) => {
        cache.members.get(message.guild, data.mentions.first(), data.arguments[0])
            .then(member => resolve(member))
            .catch(err => reject(err));
    });
}

module.exports = {
    add
};