const connection = require('../connection');
const con = connection.con;

function getDuration(data) {
    let list = JSON.parse(data.list);
    if (list === null)
        return 0;
    else {
        let dur = 0;
        for (let i in list)
            dur += Number(list[i].duration.totalSeconds);

        return dur;
    }
}

function get(message, name) {
    return new Promise((resolve, reject) => {
        con.query(`select * from PLAYLISTS where server_id = "${message.guild.id}" and name = "${name}";`, (err, result) => {
            if (err)
                reject(err);
            else {
                if (!result.length)
                    reject(null)
                else
                    resolve(result[0]);
            }
        });
    });
}

function create(message, name) {
    return new Promise((resolve, reject) => {
        con.query(`insert into PLAYLISTS (creator_id, list, name, server_id) values ("${message.author.id}", '${['null']}', "${name}", "${message.guild.id}");`, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        })
    });
}

function remove(message, name) {
    return new Promise((resolve, reject) => {
        con.query(`delete from PLAYLISTS where server_id = "${message.guild.id}" and name = "${name}";`, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        })
    })
}

function removeSong(message, name, songURL) {
    return new Promise((resolve, reject) => {
        get(message, name)
            .then(data => {
                let list;

                if (data.list == null)
                    reject(null);
                else
                    list = JSON.parse(data.list);

                let newList = [];
                let duration = 0;
                for (let i in list) {
                    if (list[i].url != songURL) {
                        newList.push(list[i])
                        duration += list[i].duration.totalSeconds;
                    }
                }

                con.query(`update PLAYLISTS set list = '${JSON.stringify(list)}' where server_id = "${message.guild.id}" and name = "${name}";`, (err, result) => {
                    if (err)
                        return console.log(err);
                    else {
                        get(message, name)
                            .then(data => {
                                let time = getDuration(data);

                                con.query(`update PLAYLISTS set duration = ${time} where server_id = "${message.guild.id}" and name = "${name}";`, (err, result) => {
                                    if (err)
                                        console.log(err);
                                });
                            })
                            .catch(e => console.log(e));
                    }
                });

                resolve(newList);
            })
    })
}

function append(message, name, song) {
    song.title = song.title.replace("'", "''");
    
    return new Promise((resolve, reject) => {
        get(message, name)
            .then(data => {
                let list = [];
                let flag = true;
                if (data.list != 'null') 
                    list = JSON.parse(data.list)
                else {
                    list = [];
                }

                let count = 0;
                while (count < list.length && flag) {
                    if (list[count].url == song.url)
                        flag = false;
                    count++;
                }

                if (!flag) {
                    reject('> Playlist already includes that song!');
                }
                else {
                    list.push(song);
                    con.query(`update PLAYLISTS set list = '${JSON.stringify(list)}' where server_id = "${message.guild.id}" and name = "${name}";`, (err, result) => {
                        if (err)
                            reject(err);
                        else {
                            get(message, name)
                                .then(data => {
                                    let time = getDuration(data);
                                    con.query(`update PLAYLISTS set duration = ${time} where server_id = "${message.guild.id}" and name = "${name}";`, (err, result) => {
                                        if (err)
                                            reject(err);
                                        else
                                            resolve(result);
                                    });
                                })
                                .catch(e => reject(e));
                        }
                    });
                }
            })
            .catch(e => reject(e));
    });
}

function getList(message, name) {
    return new Promise((resolve, reject) => {
        get(message, name)
            .then(data => {
                let list = JSON.parse(data.list);
                resolve(list);
            })
            .catch(e => {
                if (e === null)
                    message.channel.send(`> Could not find a playlist called ${name}.\n> For a full list of available playlists use\n> "playlist list"`);
                reject(e);
            });
    });
}

function getAll(message) {
    return new Promise((resolve, reject) => {
        con.query(`select * from PLAYLISTS where server_id = ${message.guild.id}`, (err, result) => {
            if (err)
                reject(err);
            else {
                if (!result.length) {
                    message.channel.send('> Could not find any playlists, try making one using\n> "playlist create <name>"');
                    reject(null);
                }
                else
                    resolve(result);
            }
        });
    })
}

module.exports = {
    create,
    get,
    append,
    getList,
    getAll,
    remove,
    removeSong
}