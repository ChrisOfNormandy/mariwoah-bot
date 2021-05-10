const { s3 } = require('../../../../aws/helpers/adapter');

 module.exports = (guild, factionName, factionData) => {
    return new Promise((resolve, reject) => {
        let file = {
            name: `${factionName}.json`,
            type: 'application/json',
            data: factionData
        };

        s3.object.putData('mariwoah', `guilds/${guild}/factions`, file)
            .then(res => resolve(res))
            .catch(err => reject(err));
    });
}