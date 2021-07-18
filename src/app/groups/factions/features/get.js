const { s3 } = require('../../../../aws/helpers/adapter');

module.exports = (guild, factionName) => {
    return new Promise((resolve, reject) => {
        s3.object.get('mariwoah', `guilds/${guild}/factions/${factionName}.json`)
            .then(res => resolve(JSON.parse(res.Body.toString())))
            .catch(err => reject(err));
    });
};