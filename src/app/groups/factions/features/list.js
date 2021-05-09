const { s3 } = require('../../../../aws/helpers/adapter');
const { chatFormat, output } = require('../../../helpers/commands');
const path = require('path');

module.exports = (message, data) => {
    return new Promise((resolve, reject) => {
        s3.object.list('mariwoah', `guilds/${message.guild.id}/factions`)
            .then(res => {
                console.log(res);

                let list = '';
                res.forEach((fac, index) => {
                    list += `${path.basename(fac.Key).replace('.json', '')}${index < res.length - 1 ? '\n' : ''}`;
                });
                
                resolve(output.valid([res], [list]));
            })
            .catch(err => reject(output.error([err], [err.message])));
    });
}