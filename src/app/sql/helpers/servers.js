function getServer(con, serverID) {
    return new Promise((resolve, reject) => {
        con.query(`select * from SERVERS where id = "${serverID}";`, (err, result) => {
            if (err)
                reject(err);
            else {
                if (result.length)
                    resolve(result[0]);
                else {
                    con.query(`insert into SERVERS (id) values ("${serverID}");`, (err, result) => {
                        if (err)
                            reject(err);
                        else
                            resolve(getServer(con, serverID));
                    });
                }
            }
        });
    });
}

function setMotd(con, serverID, string) {
    console.log(string);
    if (string.length > 255)
        return;
    getServer(con, serverID)
        .then(server => {
            con.query(`update SERVERS set motd = "${string}" where id = "${serverID}";`, (err, result) => {
                if (err)
                    console.log(err);
                else
                    con.query(`select * from SERVERS where id = "${serverID}";`, (err, result) => {
                        console.log(result);
                    });
            });
        })
}

function setPrefix(con, serverID, prefix) {
    return new Promise((resolve, reject) => {
        getServer(con, serverID)
            .then(server => {
                con.query(`update SERVERS set prefix = "${prefix[0]}" where id = "${serverID}";`, (err, result) => {
                    if (err)
                        reject(err);
                    else
                        con.query(`select * from SERVERS where id = "${serverID}";`, (err, result) => {
                            if (err)
                                reject(err);
                            else
                                resolve(result);
                        });
                });
            });
    });
}

function getMotd(con, serverID) {
    return new Promise((resolve, reject) => {
        getServer(con, serverID)
            .then(server => {
                resolve(server.motd);
            })
            .catch(e => reject(e));
    });
}

function getPrefix(con, serverID) {
    return new Promise((resolve, reject) => {
        getServer(con, serverID)
            .then(server => {
                resolve(server.prefix);
            })
            .catch(e => reject(e));
    });
}

function getRoles(con, serverID) {
    return new Promise((resolve, reject) => {
        getServer(con, serverID)
            .then(server => {
                resolve({
                    "admin": server.admin_role,
                    "mod": server.mod_role,
                    "helper": server.helper_role,
                    "vip": server.vip_role,
                    "bot": server.bot_role
                });
            })
            .catch(e => reject(e));
    });
}

function setRole(con, serverID, role, id) {
    return new Promise((resolve, reject) => {
        getServer(con, serverID)
            .then(server => {
                let column = `${role}_role`;

                con.query(`update SERVERS set ${column} = "${id}" where id = "${serverID}";`, (err, result) => {
                    if (err)
                        reject(err);
                    else {
                        con.query(`select * from SERVERS where id = "${serverID}";`, (err, result) => {
                            if (err)
                                reject(err);
                            else
                                resolve(result);
                        });
                    }
                });
            })
            .catch(e => reject(e));
    });
}

module.exports = {
    getServer,
    setMotd,
    setPrefix,
    getMotd,
    getPrefix,
    getRoles,
    setRole
}