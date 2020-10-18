const connection = require('../connection');
const con = connection.con;

/**
 * Fetches a list of songs from the provided playlist.
 * @param {string} guild_id 
 * @param {string} playlist 
 */
function get(guild_id, playlist) {
    return new Promise((resolve, reject) => {
        con.query(`select * from PLAYLISTS where server_id = "${guild_id}" and name = "${playlist}";`, (err, result) => {
            if (err)
                reject(err);
            else {
                if (!result.length)
                    resolve(null);
                else
                    con.query(`select * from PLAYLIST_SONGS where server_id = "${guild_id}" and playlist = "${playlist}";`, (err, result) => {
                        if (err)
                            reject(err);
                        else {
                            resolve(result.length ? result.sort((a, b) => { return a.list_index - b.list_index }) : []);
                        }
                    });
            }
        });
    });
}

function list(guild_id) {
    return new Promise((resolve, reject) => {
        con.query(`select * from PLAYLISTS where server_id = "${guild_id}";`, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        })
    })
}

function create(guild_id, user_id, name) {
    return new Promise((resolve, reject) => {
        con.query(`insert into PLAYLISTS (server_id, user_id, name) values ("${guild_id}", "${user_id}", "${name}");`, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        })
    });
}

function remove(guild_id, name) {
    return new Promise((resolve, reject) => {
        con.query(`delete from PLAYLISTS where server_id = "${guild_id}" and name = "${name}";`, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        })
    })
}

function addSong(guild_id, user_id, playlistName, url, song) {
    song.title = song.title.replace("'", "''");

    return new Promise((resolve, reject) => {
        get(guild_id, playlistName)
            .then(playlist => {
                con.query(`insert into PLAYLIST_SONGS (server_id, user_id, playlist, url, song, list_index) values ("${guild_id}", "${user_id}", "${playlistName}", "${url}", '${JSON.stringify(song)}', ${playlist.length});`, (err, result) => {
                    if (err)
                        reject(err);
                    else
                        resolve(result);
                });
            })
            .catch(e => reject(e));
    });
}

module.exports = {
    get,
    list,
    create,
    remove,
    addSong
}