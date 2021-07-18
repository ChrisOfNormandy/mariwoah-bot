const { s3 } = require('../../../aws/helpers/adapter');

module.exports = (guildId, filterName) => {
    return new Promise((resolve, reject) => {
        s3.object.get('mariwoah', `guilds/${guildId}/chat_filters/${filterName}.json`)
            .then(data => resolve(JSON.parse(data.Body.toString())))
            .catch(err => reject(err));
    });
};