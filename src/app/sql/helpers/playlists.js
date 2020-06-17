function getDuration(data) {
    let list = JSON.parse(data.list);
    if (list === null)
        return 0;
    else {
        let dur = 0;
        for (let i in list)
            dur += Number(list[i].duration.totalSeconds);
        console.log(dur);
        return dur;
    }
}

function get(con, message, name) {
    return new Promise((resolve, reject) =>  {
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

function create(con, message, name) {
    return new Promise((resolve, reject) =>  {
        con.query(`insert into PLAYLISTS (creator_id, list, name, server_id) values ("${message.author.id}", '${['null']}', "${name}", "${message.guild.id}");`, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        })
    });
}

function remove(con, message, name) {
    return new Promise((resolve, reject) =>  {
        con.query(`delete from PLAYLISTS where server_id = "${message.guild.id}" and name = "${name}";`, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        })
    })
}

function removeSong(con, message, name, songURL) {
    return new Promise((resolve, reject) =>  {
        get(con, message, name)
            .then(data => {
                let list;

                if (data.list == null)
                    reject(null);
                else
                    list = JSON.parse(data.list);
                console.log(songURL)
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
                        get(con, message, name)
                            .then(data => {
                                let time = getDuration(data);
    
                                con.query(`update PLAYLISTS set duration = ${time} where server_id = "${message.guild.id}" and name = "${name}";`, (err, result) => {
                                    if (err)
                                        console.log(err);
                                    else
                                        console.log(result);
                                });
                            })
                            .catch(e => console.log(e));
                    }
                });

                resolve(newList);
            })
    })
}

function append(con, message, name, song) {
    song.title = song.title.replace("'", "''");
    
    get(con, message, name)
        .then(data => {
            let list = JSON.parse(data.list);

            if (list === null)
                list = [song];
            else {
                let flag = true;
                let count = 0;
                while (count < list.length && flag) {
                    if (list[count].url == song.url)
                        flag = false;
                    count++;
                }
                if (!flag)
                    return message.channel.send('> Playlist already includes that song!');

                
                list.push(song);
            }
            con.query(`update PLAYLISTS set list = '${JSON.stringify(list)}' where server_id = "${message.guild.id}" and name = "${name}";`, (err, result) => {
                if (err)
                    return console.log(err);
                else {
                    get(con, message, name)
                        .then(data => {
                            let time = getDuration(data);

                            con.query(`update PLAYLISTS set duration = ${time} where server_id = "${message.guild.id}" and name = "${name}";`, (err, result) => {
                                if (err)
                                    console.log(err);
                                else
                                    console.log(result);
                            });
                        })
                        .catch(e => console.log(e));
                }
            });
        })
        .catch(e => console.log(e));
}

function getList(con, message, name) {
    return new Promise((resolve, reject) =>  {
        get(con, message, name)
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

function getAll(con, message) {
    return new Promise((resolve, reject) =>  {
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