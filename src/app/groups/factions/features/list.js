const path = require('path');

const { s3 } = require('../../../../aws/helpers/adapter');
const { output } = require('../../../helpers/commands');

module.exports = (message) => {
    return new Promise((resolve, reject) => {
        s3.object.list('mariwoah', `guilds/${message.guild.id}/factions`)
            .then(res => {
                let list = '';
                res.forEach((fac, index) => {
                    list += `${path.basename(fac.Key).replace('.json', '')}${index < res.length - 1 ? '\n' : ''}`;
                });

                resolve(output.valid([res], [list]));
            })
            .catch(err => {
                if (err.KeyCount == 0)
                    reject(output.error([err], ['There are no factions in this server.\nTry creating one using:\n> ~fc create']));
                else
                    reject(output.error([err], [err.message]));
            });
    });
};