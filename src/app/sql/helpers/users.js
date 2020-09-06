const connection = require('../connection');
const con = connection.con;

function get(server_id, user_id) {
    return new Promise((resolve, reject) => {
        con.query(`select * from USERS where server_id = "${server_id}" and user_id = "${user_id}";`, (err, result) => {
            if (err)
                reject(err);
            else {
                if (result.length)
                    resolve(result[0]);
                else {
                    con.query(`insert into USERS (server_id, user_id) values ("${server_id}", "${user_id}");`, (err, result) => {
                        if (err)
                            reject(err);
                        else
                            resolve(get(server_id, user_id));
                    });
                }
            }
        });
    });
}

function setPermissionLevel(server_id, user_id, level) {
    return new Promise((resolve, reject) => {
        get(server_id, user_id)
            .then(user => {
                con.query(`update USERS set permission_level = ${level} where server_id = "${server_id}" and user_id = "${user_id}";`, (err, result) => {
                    if (err)
                        reject(err);
                    else
                        con.query(`select * from USERS where server_id = "${server_id}" and user_id = "${user_id}";`, (err, result) => {
                            if (err)
                                reject(err);
                            else
                                resolve(result);
                        });
                });
            })
            .catch(e => reject(e));
    });
}

function getPermissionLevel(server_id, user_id) {
    return new Promise(function (resolve, reject) {
        get(server_id, user_id)
            .then(user => {
                resolve(user.permission_level);
            })
            .catch(e => reject(e));
    });
}

module.exports = {
    get,
    setPermissionLevel,
    getPermissionLevel
}