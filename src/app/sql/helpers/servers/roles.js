const connection = require('../connection');
const con = connection.con;
const general = require('./general');

function get(server_id) {
    return new Promise((resolve, reject) => {
        general.get(server_id)
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

function set(server_id, role, id) {
    return new Promise((resolve, reject) => {
        general.get(server_id)
            .then(server => {
                let column = `${role}_role`;
                con.query(`update SERVERS set ${column} = '${id}' where id = '${server_id}';`, (err, result) => {
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
    set
}