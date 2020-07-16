const sql = require('../../adapter');

function get(serverID) {
    return new Promise((resolve, reject) => {
        getServer(sql.con, serverID)
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

function set(serverID, role, id) {
    return new Promise((resolve, reject) => {
        getServer(sql.con, serverID)
            .then(server => {
                let column = `${role}_role`;

                sql.con.query(`update SERVERS set ${column} = "${id}" where id = "${serverID}";`, (err, result) => {
                    if (err)
                        reject(err);
                    else {
                        sql.con.query(`select * from SERVERS where id = "${serverID}";`, (err, result) => {
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
    get,
    set
}