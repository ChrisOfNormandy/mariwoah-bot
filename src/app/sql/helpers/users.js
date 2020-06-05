const query = require('./query');

function setBotRole(con, serverID, userID, roleName) {
    query.getUser(con, serverID, userID)
        .then(user => {
            con.query(`update USERS set bot_role = "${roleName}" where server_id = "${serverID}" and user_id = "${userID}";`, (err, result) => {
                if (err)
                    console.log(err);
                else
                    con.query(`select * from USERS where server_id = "${serverID}" and user_id = "${userID}";`, (err, result) => {
                        console.log(result);
                    });
            });
        })
        .catch(e => console.log(e));
}

function setPermissionLevel(con, serverID, userID, level) {
    query.getUser(con, serverID, userID)
        .then(user => {
            con.query(`update USERS set permission_level = ${level} where server_id = "${serverID}" and user_id = "${userID}";`, (err, result) => {
                if (err)
                    console.log(err);
                else
                    con.query(`select * from USERS where server_id = "${serverID}" and user_id = "${userID}";`, (err, result) => {
                        console.log(result);
                    });
            });
        })
        .catch(e => console.log(e));
}

function getBotRole(con, serverID, userID) {
    return new Promise(function(resolve, reject) {
        query.getUser(con, serverID, userID)
            .then(user => {
                resolve(user.bot_role);
            })
            .catch(e => reject(e));
    });
}

function getPermissionLevel(con, serverID, userID) {
    return new Promise(function(resolve, reject) {
        query.getUser(con, serverID, userID)
            .then(user => {
                resolve(user.permission_level);
            })
            .catch(e => reject(e));
    });
}

module.exports = {
    setBotRole,
    setPermissionLevel,
    getBotRole,
    getPermissionLevel
}