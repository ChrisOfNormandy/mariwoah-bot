const connection = require('../connection');
const con = connection.con;

const users = require('../users');

function get(message, data) {
    return new Promise((resolve, reject) => {
        con.query(`select * from USERS where server_id = '${message.guild.id}' and guild = "${data.parameters.string.name}";`, (err, result) => {
            if (err)
                reject(err)
            else {
                if (result.length)
                    resolve(result[0])
                else
                    reject(null);
            }
        });
    });
}

function getByUser(message, user_id) {
    return new Promise((resolve, reject) => {
        con.query(`select * from USERS user, GUILDS guild where guild.server_id = user.server_id and guild.name = user.guild and user.user_id = '${user_id}' and guild.server_id = '${message.guild.id}';`, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        });
    });
}

function create(message, data) {
    if (!data.parameters.string.name)
        return {
            value: 'Syntax for setting guild name is $name:"Your Guild Name"'
        };
    let obj = {
        name: data.parameters.string.name,
        server_id: message.guild.id,
        leader_id: message.author.id,
        timestamp: 0
    }

    return new Promise((resolve, reject) => {
        con.query(`insert into GUILDS (server_id, name, timestamp, limbo) values ('${obj.server_id}', "${obj.name}", '${obj.timestamp}', true);`, (err, result) => {
            if (err) {
                console.log(err);
                if (err.code == 'ER_DUP_ENTRY')
                    resolve({
                        value: 'A guild by that name already exists!'
                    });
                else
                    reject(err);
            } else {
                addMember(message, obj.name, obj.leader_id, 'leader', 'Leader')
                    .then(r => resolve({
                        value: 'Your guild is now in candidate limbo. It will be fully created when at least 3 users join.'
                    }))
                    .catch(e => reject(e));
            }
        });
    });
}

function setIcon(message, iconURL) {
    return new Promise((resolve, reject) => {
        users.get(message.guild.id, message.author.id)
            .then(user => {
                if (user.guild_role == 'leader') {
                    con.query(`update GUILDS set icon = '${iconURL}' where server_id = '${message.guild.id}' and name = '${user.guild}';`, (err, result) => {
                        if (err)
                            reject(err);
                        else
                            resolve({value: `Changed the guild icon.`});
                    });
                }
                else
                    resolve({value: `You must be a guild leader to change a guild icon.`});
            })
            .catch(e => reject(e));
    });
}

function setColor(message, color) {
    return new Promise((resolve, reject) => {
        users.get(message.guild.id, message.author.id)
            .then(user => {
                if (user.guild_role == 'leader') {
                    con.query(`update GUILDS set color = '${color}' where server_id = '${message.guild.id}' and name = '${user.guild}';`, (err, result) => {
                        if (err)
                            reject(err);
                        else
                            resolve({value: `Changed the guild color.`});
                    });
                }
                else
                    resolve({value: `You must be a guild leader to change a guild color.`});
            })
            .catch(e => reject(e));
    });
}

function setUserRole(message, user_id, role) {
    return new Promise((resolve, reject) => {
        if (role != 'leader' || role != 'officer' || role != 'member' || role != 'exhiled')
            resolve({value: `Invalid role name ${role}. Should be: leader, officer, member, exhiled.`});
        else {
            getByUser(message, user_id)
                .then(guild => {
                    getLeaders(message, guild.name)
                        .then(leaders => {
                            let flag = false;
                            if (!message.member.hasPermission("ADMINISTRATOR"))
                                for (let i in leaders)
                                    if (leaders[i].user_id == message.author.id)
                                        flag = true;
                            else
                                flag = true;

                            if (flag) {
                                con.query(`update USERS set guild_role = '${role}' where server_id = '${message.guild.id}' and name = '${guild.name}' and user_id = '${user_id}';`, (err, result) => {
                                    if (err)
                                        reject(err)
                                    else
                                        resolve({value: `Updated guild role for ${message.guild.members.cache.get(user_id).user.username} to ${role}.`});
                                })
                            }
                        })
                })
        }
    });

}

function setUserTitle(message, user_id, title) {

}

function getUsersByRole(message, role, guild_name = null) {
    return new Promise((resolve, reject) => {
        if (guild_name) {
            con.query(`select * from USERS where server_id = '${message.guild.id}' and guild = '${guild_name}' and guild_role = '${role}';`, (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result);
            });
        } else {
            getByUser(message, message.author.id)
                .then(guild => {
                    con.query(`select * from USERS where server_id = '${message.guild.id}' and guild_role = '${role}' and guild = '${guild.name}';`, (err, result) => {
                        if (err)
                            reject(err);
                        else
                            resolve(result);
                    });
                })
                .catch(e => reject(e));
        }
    });
}

function getLeaders(message, guild_name = null) {
    return getUsersByRole(message, 'leader', guild_name);
}

function getOfficers(message, guild_name = null) {
    return getUsersByRole(message, 'officer', guild_name);
}

function getMembers(message, guild_name = null) {
    return getUsersByRole(message, 'member', guild_name);
}

function getExhiled(message, guild_name = null) {
    return getUsersByRole(message, 'exhiled', guild_name);
}

function list(message) {
    return new Promise((resolve, reject) => {
        con.query(`select * from GUILDS where server_id = '${message.guild.id}';`, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        });
    });
}

function updateMembers(message, guild_name) {
    return new Promise((resolve, reject) => {
        con.query(`update GUILDS set members = (select count(*) from USERS where guild = "${guild_name}");`, (err, result) => {
            if (err)
                reject(err)
            else {
                con.query(`select * from GUILDS where server_id = '${message.guild.id}' and name = "${guild_name}";`, (err, result) => {
                    if (err)
                        reject(err);
                    else {
                        if (result.length && result[0].members <= 0) {
                            con.query(`delete from GUILDS where server_id = '${message.guild.id}' and name = "${guild_name}";`, (err, result) => {
                                if (err)
                                    reject(err);
                                else
                                    resolve({
                                        value: `Deleted ${guild_name} for having 0 members.`
                                    });
                            });
                        } else
                            resolve(null)
                    }
                });
            }
        });
    })
}

function check(message, guild_name) {
    console.log(guild_name);
    return new Promise((resolve, reject) => {
        con.query(`select * from GUILDS where server_id = '${message.guild.id}' and name = "${guild_name}";`, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result.length > 0);
        })
    })
}

function addMember(message, guild_name, user_id, role = 'member', title = '') {
    return new Promise((resolve, reject) => {
        check(message, guild_name)
            .then(r => {
                if (r)
                    con.query(`update USERS set guild = "${guild_name}", guild_role = '${role}', guild_title = '${title}' where server_id = '${message.guild.id}' and user_id = '${user_id}';`, (err, result) => {
                        if (err)
                            reject(err);
                        else {
                            updateMembers(message, guild_name)
                                .then(r => resolve(r))
                                .catch(e => reject(e));
                        }
                    });
                else
                    resolve(false);
            })
            .catch(e => reject(e));
    });
}

function removeMember(message, guild_name, user_id) {
    return new Promise((resolve, reject) => {
        con.query(`update USERS set guild = NULL where server_id = '${message.guild.id}' and user_id = '${user_id}';`, (err, result) => {
            if (err)
                reject(err);
            else
                updateMembers(message, guild_name)
                .then(r => resolve(r))
                .catch(e => reject(e));
        });
    });
}

module.exports = {
    get,
    create,
    getByUser,

    setIcon,
    setColor,

    list,
    check,
    addMember,
    removeMember,
    setUserRole,
    setUserTitle,

    getLeaders,
    getOfficers,
    getMembers,
    getExhiled
}