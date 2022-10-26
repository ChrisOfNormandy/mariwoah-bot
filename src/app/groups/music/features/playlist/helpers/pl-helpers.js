const { handlers } = require('@chrisofnormandy/mariwoah-bot');

const { database } = handlers;

function getPlaylist(guildId, name) {
    return new Promise((resolve, reject) => {
        database.select('playlists', {
            name,
            guild_created_id: guildId
        })
            .then((results) => {
                resolve(results);
            })
            .catch((err) => reject(err));
    });
}

module.exports = {
    getPlaylist
};