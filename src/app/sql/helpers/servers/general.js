const connection = require('../../connection');
const con = connection.con;

function get(server_id) {
    return new Promise((resolve, reject) => {
        con.query(`select * from SERVERS where id = "${server_id}";`, (err, result) => {
            if (err)
                reject(err);
            else {
                if (result.length)
                    resolve(result[0]);
                else {
                    con.query(`insert into SERVERS (id) values ("${server_id}");`, (err, result) => {
                        if (err)
                            reject(err);
                        else
                            resolve(get(server_id));
                    });
                }
            }
        });
    });
}

function setMotd(server_id, json) {
    let string = JSON.stringify(json);
    return new Promise((resolve, reject) => {
        get(server_id)
            .then(server => {
                con.query(`update SERVERS set motd = '${string}' where id = "${server_id}";`, (err, result) => {
                    if (err)
                        reject(err);
                    else
                        con.query(`select * from SERVERS where id = "${server_id}";`, (err, result) => {
                            resolve(result);
                        });
                });
            })
    });
}

function getMotd(server_id) {
    return new Promise((resolve, reject) => {
        get(server_id)
            .then(server => resolve(server.motd))
            .catch(e => reject(e));
    });
}

function setPrefix(server_id, prefix) {
    return new Promise((resolve, reject) => {
        get(server_id)
            .then(server => {
                con.query(`update SERVERS set prefix = "${prefix[0]}" where id = "${server_id}";`, (err, result) => {
                    if (err)
                        reject(err);
                    else
                        con.query(`select * from SERVERS where id = "${server_id}";`, (err, result) => {
                            if (err)
                                reject(err);
                            else
                                resolve(result);
                        });
                });
            });
    });
}

function getPrefix(server_id) {
    return new Promise((resolve, reject) => {
        get(server_id)
            .then(server => {
                resolve(server.prefix);
            })
            .catch(e => reject(e));
    });
}

module.exports = {
    get,
    setMotd,
    getMotd,
    setPrefix,
    getPrefix
}