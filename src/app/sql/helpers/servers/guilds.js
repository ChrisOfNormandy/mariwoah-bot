const connection = require('../connection');
const con = connection.con;

const chatFormat = require('../../../common/bot/helpers/global/chatFormat');
const users = require('../users');
const setRoles = require('../../../rolemanagement/helpers/setRoles');

// Fetch guild
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

function getByName(message, guild_name) {
    return new Promise((resolve, reject) => {
        con.query(`select * from GUILDS where server_id = '${message.guild.id}' and name = '${guild_name}';`, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        })
    })
}

function getByUser(message, user_id) {
    return new Promise((resolve, reject) => {
        con.query(`select * from GUILDS guild, USERS user where guild.server_id = user.server_id and guild.name = user.guild and user.user_id = '${user_id}' and guild.server_id = '${message.guild.id}';`, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        });
    });
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

function check(message, guild_name) {
    return new Promise((resolve, reject) => {
        con.query(`select * from GUILDS where server_id = '${message.guild.id}' and name = "${guild_name}";`, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result.length > 0);
        })
    })
}

// Guild work
function create(message, data) {
    if (!data.parameters.string.name)
        return {
            value: chatFormat.response.syntax.error(`Missing parameter $name`)
        };

    let obj = {
        name: data.parameters.string.name,
        server_id: message.guild.id,
        leader_id: message.author.id,
        timestamp: message.createdTimestamp
    }

    return new Promise((resolve, reject) => {
        con.query(`insert into GUILDS (server_id, name, timestamp, limbo, text_assets) values ('${obj.server_id}', "${obj.name}", '${obj.timestamp}', true, '{"lore":"","motto":""}');`, (err, result) => {
            if (err) {
                if (err.code == 'ER_DUP_ENTRY')
                    resolve({
                        value: chatFormat.response.guilds.create.already_exists(obj.name)
                    });
                else
                    reject(err);
            } else {
                addMember(message, obj.name, obj.leader_id, 'leader', 'Leader', true)
                    .then(r => resolve({
                        value: chatFormat.response.guilds.create.success(obj.name)
                    }))
                    .catch(e => reject(e));
            }
        });
    });
}

function setLimbo(message, guild_name, value = true) {
    return new Promise((resolve, reject) => {
        con.query(`update GUILDS set limbo = ${value} where server_id = '${message.guild.id}' and name = '${guild_name}';`, (err, result) => {
            if (err)
                reject(err)
            else
                resolve(value);
        })
    })
}

function purge(message, guild_name) {
    return new Promise((resolve, reject) => {
        getByName(message, guild_name)
            .then(guilds => {
                if (guilds.length) {
                    const guild = guilds[0];

                    let promise_arr = [
                        deleteInvite(message, guild.name),
                        purgeUserData(message, guild.name)
                    ];

                    Promise.all(promise_arr)
                        .then(results => {
                            con.query(`delete from GUILDS where server_id = '${message.guild.id}' and name = '${guild.name}';`, (err, result) => {
                                if (err)
                                    reject(err);
                                else
                                    resolve(result);
                            });
                        })
                        .catch(e => reject(e));
                } else
                    resolve({
                        value: chatFormat.response.guilds.delete.not_found(guild_name)
                    });
            })
            .catch(e => reject(e));
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
                            resolve({
                                value: chatFormat.response.guilds.icon.success(user.guild)
                            });
                    });
                } else
                    resolve({
                        value: chatFormat.response.guilds.icon.no_perms()
                    });
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
                        else {
                            getByName(message, user.guild)
                                .then(guildList => {
                                    const guild = guildList[0];

                                    if (message.guild.roles.cache.has(guild.role_id))
                                        message.guild.roles.cache.get(guild.role_id).setColor(color);
                                    resolve({
                                        value: chatFormat.response.guilds.color.success(user.guild)
                                    });
                                })
                                .catch(e => reject(e));
                        }
                    });
                } else
                    resolve({
                        value: chatFormat.response.guilds.color.no_perms()
                    });
            })
            .catch(e => reject(e));
    });
}

function setUserRole(message, user_id, role) {
    return new Promise((resolve, reject) => {
        if (role != 'leader' && role != 'officer' && role != 'member' && role != 'exhiled')
            resolve({
                value: chatFormat.response.guilds.role.error(role)
            });
        else {
            con.query(`update USERS set guild_role = '${role}' where server_id = '${message.guild.id}' and guild = '${guild.name}' and user_id = '${user_id}';`, (err, result) => {
                if (err)
                    reject(err)
                else
                    resolve({
                        value: chatFormat.response.guilds.role.success(message.guild.members.cache.get(user_id).user.username, role)
                    });
            });
        }
    });

}

function setUserTitle(message, guild_name, user_id, title) {
    console.log(message, guild_name, user_id, title);
    return new Promise((resolve, reject) => {
        con.query(`update USERS set guild_title = '${title}' where server_id = '${message.guild.id}' and guild = '${guild_name}' and user_id = '${user_id}';`, (err, result) => {
            if (err)
                reject(err)
            else
                resolve({
                    value: chatFormat.response.guilds.role.success(message.guild.members.cache.get(user_id).user.username, title)
                });
        });
    })
}

function setLore(message, guild_name, lore) {
    return new Promise((resolve, reject) => {
        con.query(`select text_assets from GUILDS where server_id = '${message.guild.id}' and name = '${guild_name}';`, (err, result) => {
            if (err)
                reject(err);
            else {
                if (result.length) {
                    let json = JSON.parse(result[0].text_assets) || {
                        "lore": "",
                        "motto": ""
                    };
                    json.lore = lore;

                    con.query(`update GUILDS set text_assets = '${JSON.stringify(json)}' where server_id = '${message.guild.id}' and name = '${guild_name}';`, (err, result) => {
                        if (err)
                            reject(err);
                        else
                            resolve(result);
                    })
                }
            }
        });
    });
}

function setMotto(message, guild_name, motto) {
    return new Promise((resolve, reject) => {
        con.query(`select text_assets from GUILDS where server_id = '${message.guild.id}' and name = '${guild_name}';`, (err, result) => {
            if (err)
                reject(err);
            else {
                if (result.length) {
                    let json = JSON.parse(result[0].text_assets) || {
                        "lore": "",
                        "motto": ""
                    };
                    json.motto = motto;

                    con.query(`update GUILDS set text_assets = '${JSON.stringify(json)}' where server_id = '${message.guild.id}' and name = '${guild_name}';`, (err, result) => {
                        if (err)
                            reject(err);
                        else
                            resolve(result);
                    })
                }
            }
        });
    });
}

// Guild members
function getUserIds(message, guild_name) {
    return new Promise((resolve, reject) => {
        con.query(`select user_id from USERS where guild = '${guild_name}' and server_id = '${message.guild.id}';`, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        });
    });
}

function stripRoles(message, guild_name, user_id = null) {
    return new Promise((resolve, reject) => {
        getByName(message, guild_name)
            .then(guildList => {
                if (guildList.length) {
                    const guild = guildList[0];

                    let arr = [];
                    if (!user_id)
                        message.guild.members.cache.forEach((v, k, m) => {
                            v.roles.cache.forEach((role, id) => {
                                if (id == guild.role_id)
                                    arr.push(setRoles.remove(message, v, guild.role_id));
                            });
                        });
                    else
                        arr.push(setRoles.remove(message, message.guild.members.cache.get(user_id), guild.role_id))

                    Promise.all(arr)
                        .then(results => resolve(results))
                        .catch(e => reject(e));
                }
            })
            .catch(e => reject(e));
    });
}

function purgeUserData(message, guild_name) {
    return new Promise((resolve, reject) => {
        getByName(message, guild_name)
            .then(guildList => {
                if (guildList.length) {
                    const guild = guildList[0];

                    let arr = [];
                    message.guild.members.cache.forEach((v, k, m) => {
                        v.roles.cache.forEach((role, id) => {
                            if (id == guild.role_id)
                                arr.push(setRoles.remove(message, v, guild.role_id));
                        });
                    });

                    Promise.all(arr)
                        .then(results => {
                            con.query(`update USERS set guild = NULL, guild_role = NULL, guild_title = '' where server_id = '${message.guild.id}' and guild = '${guild_name}';`, (err, result) => {
                                if (err)
                                    reject(err);
                                else
                                    resolve(result);
                            });
                        })
                        .catch(e => reject(e));
                }
            })
            .catch(e => reject(e));
    });
}

function getUsersByRole(message, role, guild_name = null) {
    return new Promise((resolve, reject) => {
        if (guild_name != null) {
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

function isLeader(message, guild_name, user_id = null) {
    return new Promise((resolve, reject) => {
        getLeaders(message, guild_name)
            .then(leaders => {
                let filter = (user_id != null) ?
                    leaders.filter(id => id.user_id == user_id) :
                    leaders.filter(id => id.user_id == message.author.id);

                resolve(filter[0].guild_role == 'leader');
            })
            .catch(e => reject(e));
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

function updateMembers(message, guild_name, user_id = null) {
    return new Promise((resolve, reject) => {
        getByName(message, guild_name)
            .then(guilds => {
                if (guilds.length > 0) {
                    const guild = guilds[0];
                    const old_members = guild.members;

                    con.query(`update GUILDS set members = (select count(*) from USERS where guild = "${guild.name}" and server_id = '${message.guild.id}');`, (err, result) => {
                        if (err)
                            reject(err)
                        else {
                            getByName(message, guild.name)
                                .then(guilds_updated => {
                                    const guild_updated = guilds_updated[0];
                                    const current_members = guild_updated.members;

                                    // Gained a member
                                    if (old_members < current_members) {
                                        if (guild.limbo && current_members >= 3) {
                                            setLimbo(message, guild.name, false)
                                                .then(r => {
                                                    setRoles.create(message, guild.name, guild.color)
                                                        .then(role => {
                                                            con.query(`update GUILDS set role_id = ${role.id} where server_id = '${guild.server_id}' and name = '${guild.name}';`, (err, result) => {
                                                                if (err)
                                                                    reject(err);
                                                                else {
                                                                    getUserIds(message, guild.name)
                                                                        .then(ids => {
                                                                            let arr = [];
                                                                            for (let i in ids)
                                                                                arr.push(setRoles.add(message, message.guild.members.cache.get(ids[i].user_id), role.id));

                                                                            Promise.all(arr)
                                                                                .then(results => {
                                                                                    console.log(results);
                                                                                    resolve({
                                                                                        value: chatFormat.response.guilds.create.establish(guild.name, current_members)
                                                                                    })
                                                                                })
                                                                                .catch(e => reject(e));
                                                                        })
                                                                        .catch(e => reject(e));
                                                                }
                                                            });

                                                        })
                                                        .catch(e => reject(e));
                                                })
                                                .catch(e => reject(e));
                                        } else {
                                            if (user_id)
                                                setRoles.add(message, message.guild.members.cache.get(user_id), guild.role_id)
                                                    .then(r => resolve({value: '', status: true})) // Gained member, already valid
                                                    .catch(e => reject(e));
                                            else
                                                resolve({value: '', status: true}) // Gained member, already valid
                                        }
                                    } else { // Lost a member or stayed the same
                                        if (current_members <= 0) {
                                            purge(message, guild.name)
                                                .then(result => resolve({
                                                    value: chatFormat.response.guilds.delete.abandoned(guild.name)
                                                }))
                                                .catch(e => reject(e));
                                        } else {
                                            if (current_members < 3) {
                                                setLimbo(message, guild.name, true)
                                                    .then(r => {
                                                        getLeaders(message, guild.name)
                                                            .then(leaders => {
                                                                if (leaders.length == 0) {
                                                                    getOfficers(message, guild.name)
                                                                        .then(officers => {
                                                                            if (officers.length == 0) {
                                                                                purge(message, guild.name)
                                                                                    .then(result => resolve({
                                                                                        value: chatFormat.response.guilds.delete.no_leader(guild.name)
                                                                                    }))
                                                                                    .catch(e => reject(e));
                                                                            } else {
                                                                                setUserRole(message, officers[0].user_id, 'leader')
                                                                                    .then(result => {
                                                                                        getUserIds(message, guild.name)
                                                                                            .then(ids => {
                                                                                                let arr = [];
                                                                                                for (let i in ids)
                                                                                                    setRoles.remove(message, message.guild.members.cache.get(ids[i].user_id), guild.role_id)

                                                                                                Promise.all(arr)
                                                                                                    .then(results => {
                                                                                                        resolve({
                                                                                                            value: chatFormat.response.guilds.role.promote_leader(message.guild.members.cache.get(officers[0].user_id), guild.name)
                                                                                                        })
                                                                                                    })
                                                                                                    .catch(e => reject(e));
                                                                                            })
                                                                                            .catch(e => reject(e));

                                                                                    })
                                                                                    .catch(e => reject(e));
                                                                            }
                                                                        })
                                                                        .catch(e => reject(e))
                                                                } else {
                                                                    stripRoles(message, guild.name)
                                                                        .then(r => resolve({value: chatFormat.response.guilds.create.undo(guild.name, current_members)}))
                                                                        .catch(e => reject(e));
                                                                }
                                                            })
                                                            .catch(e => reject(e));
                                                    })
                                                    .catch(e => reject(e));
                                            } else {
                                                getLeaders(message, guild.name)
                                                    .then(leaders => {
                                                        if (leaders.length == 0) {
                                                            getOfficers(message, guild.name)
                                                                .then(officers => {
                                                                    if (officers.length == 0) {
                                                                        purge(message, guild.name)
                                                                            .then(result => resolve({
                                                                                value: chatFormat.response.guilds.delete.no_leader(guild.name)
                                                                            }))
                                                                            .catch(e => reject(e));
                                                                    } else {
                                                                        setUserRole(message, officers[0].user_id, 'leader')
                                                                            .then(result => resolve({
                                                                                value: chatFormat.response.guilds.role.promote_leader(message.guild.members.cache.get(officers[0].user_id), guild.name)
                                                                            }))
                                                                            .catch(e => reject(e));
                                                                    }
                                                                })
                                                                .catch(e => reject(e));
                                                        }
                                                        else {
                                                            if (old_members == current_members)
                                                                resolve({value: chatFormat.response.guilds.join.no_change(), status: null}); // No change
                                                            else {
                                                                if (user_id)
                                                                    setRoles.remove(message, message.guild.members.cache.get(user_id), guild.role_id)
                                                                        .then(r => resolve({value: '', status: false})) // Gained member, already valid
                                                                        .catch(e => reject(e));
                                                                else
                                                                    resolve({value: '', status: false})
                                                            }
                                                        }
                                                    })
                                                    .catch(e => reject(e));
                                            }
                                        }
                                    }
                                })
                                .catch(e => reject(e));
                        }
                    });
                } else
                    reject(result);
            })
            .catch(e => reject(e));
    });
}

function addMember(message, guild_name, user_id, role = 'member', title = '') {
    return new Promise((resolve, reject) => {
        con.query(`update USERS set guild = "${guild_name}", guild_role = '${role}', guild_title = '${title}' where server_id = '${message.guild.id}' and user_id = '${user_id}';`, (err, result) => {
            if (err)
                reject(err);
            else {
                updateMembers(message, guild_name, user_id)
                    .then(result => resolve([user_id, result]))
                    .catch(e => reject(e));
            }
        });
    });
}

function removeMember(message, guild_name, user_id) {
    return new Promise((resolve, reject) => {
        con.query(`update USERS set guild = NULL, guild_role = NULL, guild_title = '' where server_id = '${message.guild.id}' and user_id = '${user_id}';`, (err, result) => {
            if (err)
                reject(err);
            else
                updateMembers(message, guild_name, user_id)
                    .then(result => resolve([user_id, result]))
                    .catch(e => reject(e));
        });
    });
}

function inviteMember(message, guild_name, user_id) {
    return new Promise((resolve, reject) => {
        con.query(`insert into GUILD_INVITES (server_id, guild_name, user_id, issued_user_id) values ('${message.guild.id}', '${guild_name}', '${user_id}', '${message.author.id}');`, (err, result) => {
            if (err) {
                if (err.code == 'ER_DUP_ENTRY')
                    resolve({
                        value: chatFormat.response.guilds.invite.duplicate(message.guild.members.cache.get(user_id).user.username)
                    });
                else
                    reject(err);
            } else
                resolve({
                    value: chatFormat.response.guilds.invite.success(message.guild.members.cache.get(user_id).user.username, guild_name)
                });
        });
    });
}

function getUserInvites(message, user_id, guild_name = null) {
    return new Promise((resolve, reject) => {
        con.query(`select * from GUILD_INVITES where server_id = '${message.guild.id}' and user_id = '${user_id}'${guild_name != null ? ` and guild_name = '${guild_name}'` : ''};`, (err, result) => {
            if (err)
                reject(err);
            else
                resolve(result);
        })
    })
}

function deleteInvite(message, guild_name, user_id = null) {
    return new Promise((resolve, reject) => {
        const server_id = message.guild.id;
        if (user_id !== null) {
            getUserInvites(message, user_id, guild_name)
                .then(invites => {
                    if (invites.length)
                        con.query(`delete from GUILD_INVITES where server_id = '${server_id}' and guild_name = '${guild_name}' and user_id = '${user_id}';`, (err, result) => {
                            if (err)
                                reject(err);
                            else
                                resolve({
                                    value: chatFormat.response.guilds.invite.reject(message.guild.members.cache.get(user_id).user.username, guild_name)
                                });
                        });
                    else
                        resolve({
                            value: chatFormat.response.guilds.invite.not_found(message.guild.members.cache.get(user_id).user.username, guild_name)
                        })
                })
                .catch(e => reject(e));
        } else {
            con.query(`delete from GUILD_INVITES where server_id = '${server_id}' and guild_name = '${guild_name}';`, (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result);
            });
        }
    })
}

function toggleInvites(message, guild) {
    return new Promise((resolve, reject) => {
        con.query(`update GUILDS set invite_only = ${!guild.invite_only} where server_id = '${message.guild.id}' and name = '${guild.name}';`, (err, result) => {
            if (err)
                reject(err);
            else
                resolve({value: chatFormat.response.guilds.invite.toggle(guild.name, !guild.invite_only)});
        });
    });
}

module.exports = {
    get,
    create,
    getByUser,
    getByName,
    purge,

    setIcon,
    setColor,
    setLore,
    setMotto,

    list,
    check,
    addMember,
    removeMember,
    inviteMember,
    deleteInvite,
    updateMembers,
    toggleInvites,

    setUserRole,
    setUserTitle,

    getUserInvites,
    getLeaders,
    getOfficers,
    getMembers,
    getExhiled,
    isLeader
}