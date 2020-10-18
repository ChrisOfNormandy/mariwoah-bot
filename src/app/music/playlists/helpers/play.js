const sql = require('../../../sql/adapter');
const append = require('../../helpers/queue/append');
const commondFormat = require('../../../common/bot/helpers/global/commandFormat');

module.exports = function (message, data) {
    return new Promise((resolve, reject) => {
        let name = data.arguments[0];

        const guild_id = (!!data.parameters.string['guild'])
            ? data.parameters.string['guild']
            : message.guild.id;

        sql.playlists.get(guild_id, name)
            .then(list => {
                if (list === null)
                    reject(commondFormat.error([], [`Could not find a playlist named ${name}.`]));
                else {                    
                    let song;
                    let songs = [];
                    for (let i in list) {
                        song = JSON.parse(list[i].song);
                        songs.push(song);
                    }

                    append(message, songs, data.flags)
                        .then(res => resolve(res))
                        .catch(e => reject(e));
                }
            })
            .catch(e => reject(e));
    });
}