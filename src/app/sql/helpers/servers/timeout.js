const connection = require('../connection');
const con = connection.con;

const getAge = require('../../../common/bot/helpers/global/getAge');

function role(message) {
    return new Promise((resolve, reject) => {
    con.query(`select * from TIMEOUTS where server_id = '${message.guild.id}' and name = 'role';`, (err, result) => {
        if (err)
            reject(err);
        else {
            if (result.length) {
                const value = result[0];

                const age = getAge.byTimestamp(value.timestamp, message.createdTimestamp);
                resolve(age);
            }
            else {
                con.query(`insert into TIMEOUTS (name, server_id, timestamp, trigger_value) values ('role', '${message.guild.id}', '${message.createdTimestamp}', 50);`, (err, result) => {
                    if (err)
                        reject(err)
                    else
                        resolve(role(message));
                });
            }
        }
    });
});
}