const Discord = require('discord.js');
const path = require('path');

const { s3 } = require('../../../helpers/aws');

/**
 * 
 * @param {Discord} guild 
 * @returns {Promise<string[]>}
 */
module.exports = (guild) => {
    return new Promise((resolve, reject) => {
        s3.listObjects('mariwoah', `guilds/${guild.id}/factions`)
            .then(res => resolve(res.map(fac => { return `${path.basename(fac.Key).replace('.json', '')}`; })))
            .catch(err => reject(err));
    });
};