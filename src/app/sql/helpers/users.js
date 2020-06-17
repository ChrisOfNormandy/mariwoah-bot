function getUser(con, serverID, userID) {
    return new Promise((resolve, reject) => {
        con.query(`select * from USERS where server_id = "${serverID}" and user_id = "${userID}";`, (err, result) => {
            if (err)
                reject(err);
            else {
                if (result.length)
                    resolve(result[0]);
                else {
                    con.query(`insert into USERS (server_id, user_id) values ("${serverID}", "${userID}");`, (err, result) => {
                        if (err)
                            reject(err);
                        else
                            resolve(getUser(con, serverID, userID));
                    });
                }
            }
        });
    });
}

function setBotRole(con, serverID, userID, roleName) {
    return new Promise((resolve, reject) => {
        getUser(con, serverID, userID)
            .then(user => {
                con.query(`update USERS set bot_role = "${roleName}" where server_id = "${serverID}" and user_id = "${userID}";`, (err, result) => {
                    if (err)
                        reject(err);
                    else
                        con.query(`select * from USERS where server_id = "${serverID}" and user_id = "${userID}";`, (err, result) => {
                            if (err)
                                reject(err);
                            else
                                resolve(result);
                        });
                });
            })
            .catch(e => reject(e));
    })

}

function setPermissionLevel(con, serverID, userID, level) {
    return new Promise((resolve, reject) => {
        getUser(con, serverID, userID)
            .then(user => {
                con.query(`update USERS set permission_level = ${level} where server_id = "${serverID}" and user_id = "${userID}";`, (err, result) => {
                    if (err)
                        reject(err);
                    else
                        con.query(`select * from USERS where server_id = "${serverID}" and user_id = "${userID}";`, (err, result) => {
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

function getBotRole(con, serverID, userID) {
    return new Promise(function (resolve, reject) {
        getUser(con, serverID, userID)
            .then(user => {
                resolve(user.bot_role);
            })
            .catch(e => reject(e));
    });
}

function getPermissionLevel(con, serverID, userID) {
    return new Promise(function (resolve, reject) {
        getUser(con, serverID, userID)
            .then(user => {
                resolve(user.permission_level);
            })
            .catch(e => reject(e));
    });
}

module.exports = {
    getUser,
    setBotRole,
    setPermissionLevel,
    getBotRole,
    getPermissionLevel
}