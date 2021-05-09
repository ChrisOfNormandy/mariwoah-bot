const {s3} = require('../../../../aws/helpers/adapter');
const { chatFormat, output } = require('../../../helpers/commands');

module.exports = (message, factionName) => {
    return new Promise((resolve, reject) => {
        s3.object.get('mariwoah', `guilds/${message.guild.id}/factions/${factionName}.json`)
            .then(res => resolve(JSON.parse(res.Body.toString())))
            .catch(err => reject(err));
    });
}