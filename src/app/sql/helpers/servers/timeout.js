const connection = require('../connection');
const con = connection.con;

const getAge = require('../../../common/bot/helpers/global/getAge');

function roleAge(message) {
    return new Promise((resolve, reject) => {
        con.query(`select * from TIMEOUTS where server_id = '${message.guild.id}' and name = 'role';`, (err, result) => {
            if (err)
                reject(err);
            else {
                if (result.length) {
                    const value = result[0];

                    const age = getAge.byTimestamp(Number(value.timestamp), message.createdTimestamp);

                    resolve({
                        date: age,
                        value: value.value < value.trigger_value,
                        current: value.value
                    });
                } else {
                    console.log(`Made new entry for timeouts - ROLES - for server ${message.guild.name} : ${message.guild.id}`)
                    con.query(`insert into TIMEOUTS (name, server_id, timestamp, trigger_value) values ('role', '${message.guild.id}', '${message.createdTimestamp}', 50);`, (err, result) => {
                        if (err)
                            reject(err)
                        else
                            resolve(roleAge(message));
                    });
                }
            }
        });
    });
}

function checkRole(message) {
    return new Promise((resolve, reject) => {
        roleAge(message)
            .then(age => {
                resolve(age.value);
            })
            .catch(e => reject(e));
    })
}

function checkRole_upTick(message) {
    return new Promise((resolve, reject) => {
        roleAge(message)
            .then(age => {
                con.query(`update TIMEOUTS set value = ${age.current + 1} where server_id = '${message.guild.id}' and name = 'role';`, (err, result) => {
                    if (err)
                        reject(err)
                    else {
                        if ((age.current++) % 10 == 0)
                            message.channel.send(`This server has created ${age.current + 1} / 50 roles in the last 48 hours.`);
                        resolve(age.value)
                    }
                })
                resolve(age);
            })
            .catch(e => reject(e));
    })
}

function toMessage(message) {
    return new Promise((resolve, reject) => {
        roleAge(message)
            .then(val => resolve({
                value: JSON.stringify(val)
            }))
            .catch(e => reject(e));
    });
}

module.exports = {
    roleAge,
    checkRole,
    checkRole_upTick,
    toMessage
}