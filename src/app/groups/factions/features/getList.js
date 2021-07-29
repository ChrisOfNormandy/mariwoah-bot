const {Discord} = require('@chrisofnormandy/mariwoah-bot');
const path = require('path');

const { s3 } = require('../../../../aws/helpers/adapter');

/**
 * 
 * @param {Discord} guild 
 * @returns {Promise<string[]>}
 */
module.exports = (guild) => {
    return new Promise((resolve, reject) => {
        s3.object.list('mariwoah', `guilds/${guild.id}/factions`)
            .then(res => resolve(res.map(fac => { return `${path.basename(fac.Key).replace('.json', '')}`; })))
            .catch(err => reject(err));
    });
};