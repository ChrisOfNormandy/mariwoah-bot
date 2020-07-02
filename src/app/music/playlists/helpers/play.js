const shuffle = require('../../../common/bot/helpers/global/shuffle');
const db = require('../../../sql/adapter');
const append = require('../../helpers/queue/append');
const chatFormat = require('../../../common/bot/helpers/global/chatFormat');

module.exports = function (message, data) {
    return new Promise((resolve, reject) => {
        let name = data.arguments[1];

        db.playlists.get(message, name)
            .then(db_data => {
                let list;
                if (db_data.list != 'null') 
                    list = JSON.parse(db_data.list)
                else {
                    list = [];
                }

                if (!list.length)
                    reject(chatFormat.response.music.playlist.no_data());
                else {

                    if (data.flags['s']) {
                        shuffle(list)
                            .then(array => resolve(append(message, null, array, data.flags)))
                            .catch(e => reject(e));
                    }
                    else {
                        resolve(append(message, null, list, data.flags));
                    }
                }
            })
            .catch(e => reject(e));
    });
}