const { s3 } = require('../../../../aws/helpers/adapter');

 module.exports = (guild, factionName, factionData) => {
    return new Promise((resolve, reject) => {
        s3.object.putData('mariwoah', `guilds/${guild}/factions`, `${factionName}.json`, JSON.stringify(factionData))
            .then(res => resolve(res))
            .catch(err => reject(err));
    });
}