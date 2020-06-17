const sql = require('../../sql/adapter');
const config = require('./role_config');
const setPermission = require('./setPermission');

function checkRole(message, name, id) {
    return new Promise((resolve, reject) => {
        if (message.guild.roles.cache.has(id)) {
            message.guild.roles.fetch(id)
                .then(role => resolve({name, id: role.id}))
                .catch(e => reject(e));
        }
        else {
            message.channel.send(`> Could not fetch the ${name} role with the id: ${id}.\n`);
            reject(id);
        }
    });
}

function refresh(message, member, roleMap) {
    return new Promise((resolve, reject) => {
        console.log(`Refreshing user: ${member.user.username}`);
        sql.server.getRoles(message.guild.id)
            .then(sql_roles => {
                console.log(sql_roles);
                sql.user.getBotRole(message.guild.id, member.id)
                    .then(bot_role => {
                        console.log(bot_role);
                        sql.user.getPermissionLevel(message.guild.id, member.id)
                            .then(level => {
                                let admin, mod, helper, vip, bot = false;

                                member.roles.cache.forEach((role, k, m) => {
                                    if (role.id == roleMap.admin)
                                        admin = true;
                                    if (role.id == roleMap.mod)
                                        mod = true;
                                    if (role.id == roleMap.helper)
                                        helper = true;
                                    if (role.id == roleMap.vip)
                                        vip = true;
                                    if (role.id == roleMap.bot)
                                        bot = true;
                                });

                                if (member.user.bot) {
                                    remove(message, member, roleMap.admin)
                                    remove(message, member, roleMap.mod);
                                    remove(message, member, roleMap.helper);
                                    remove(message, member, roleMap.vip);

                                    if (!bot)
                                        add(message, member, roleMap.bot)
                                            .then(r => resolve(r))
                                            .catch(e => reject(e));
                                    else
                                        resolve(true);
                                }
                                else {
                                    if (!admin && (member.hasPermission("ADMINISTRATOR") || level == 4)) {
                                        remove(message, member, roleMap.mod);
                                        remove(message, member, roleMap.helper);
                                        remove(message, member, roleMap.vip);
                                        add(message, member, roleMap.admin)
                                            .then(r => resolve(r))
                                            .catch(e => reject(e));
                                    }

                                    else if (!mod && level == 3) {
                                        remove(message, member, roleMap.admin);
                                        remove(message, member, roleMap.helper);
                                        remove(message, member, roleMap.vip);
                                        add(message, member, roleMap.mod)
                                            .then(r => resolve(r))
                                            .catch(e => reject(e));
                                    }

                                    else if (!helper && level == 2) {
                                        remove(message, member, roleMap.admin);
                                        remove(message, member, roleMap.mod);
                                        remove(message, member, roleMap.vip);
                                        add(message, member, roleMap.helper)
                                            .then(r => resolve(r))
                                            .catch(e => reject(e));
                                    }

                                    else if (!vip && level == 1) {
                                        remove(message, member, roleMap.admin);
                                        remove(message, member, roleMap.mod);
                                        remove(message, member, roleMap.helper);
                                        add(message, member, roleMap.vip)
                                            .then(r => resolve(r))
                                            .catch(e => reject(e));
                                    }
                                    else {
                                        remove(message, member, roleMap.admin);
                                        remove(message, member, roleMap.mod);
                                        remove(message, member, roleMap.helper);
                                        remove(message, member, roleMap.vip);
                                        resolve(true);
                                    }
                                }
                            })
                            .catch(e => reject(e));
                    })
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}

function refresh_user(message, member) {
    sql.server.getRoles(message.guild.id)
        .then(sql_roles => {
            let roleArr = [
                checkRole(message, 'admin', sql_roles.admin),
                checkRole(message, 'mod', sql_roles.mod),
                checkRole(message, 'helper', sql_roles.helper),
                checkRole(message, 'vip', sql_roles.vip),
                checkRole(message, 'bot', sql_roles.bot)
            ];

            Promise.all(roleArr)
                .then(rolesArr => {
                    let roles = rolesArr.reduce((map, obj) => {
                        map[obj.name] = obj.id;
                        return map;
                    }, {});

                    refresh(message, member, roles);
                })
                .catch((err) => console.log(err));
        })
        .catch(e => reject(e));
}

function refresh_guild(message) {
    sql.server.getRoles(message.guild.id)
        .then(sql_roles => {
            let roleArr = [
                checkRole(message, 'admin', sql_roles.admin),
                checkRole(message, 'mod', sql_roles.mod),
                checkRole(message, 'helper', sql_roles.helper),
                checkRole(message, 'vip', sql_roles.vip),
                checkRole(message, 'bot', sql_roles.bot)
            ];

            Promise.all(roleArr)
                .then(rolesArr => {
                    let roles = rolesArr.reduce((map, obj) => {
                        map[obj.name] = obj.id;
                        return map;
                    }, {});

                    let toResolve = [];
                    message.guild.members.cache.forEach((member, k, m) => {
                        toResolve.push(refresh(message, member, roles));
                    });

                    Promise.all(toResolve)
                        .then(results => {
                            console.log(results);
                        })
                        .catch(e => console.log(e));
                })
                .catch((err) => console.log(err));
        });
}

function add(message, member, roleID) {
    return new Promise((resolve, reject) => {
        message.guild.roles.fetch(roleID)
            .then(role => {
                console.log(role);
                member.roles.add(message.guild.roles.resolve(role))
                    .then(r => resolve(r))
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}

function remove(message, member, roleID) {
    return new Promise((resolve, reject) => {
        message.guild.roles.fetch(roleID)
            .then(role => {
                console.log(role);
                member.roles.remove(message.guild.roles.resolve(role))
                    .then(r => resolve(r))
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}

function getRole(message, id) {
    return new Promise((resolve, reject) => {
        message.guild.roles.fetch(id)
            .then(r => resolve(r))
            .catch(e => reject(e));
    });
}

function setRole(message, name, role) {
    return new Promise((resolve, reject) => {
        if (role) {
            sql.server.setRole(message.guild.id, name, role.id)
                .then(r => resolve(r))
                .catch(e => reject(e));
        }
        else {
            reject(role);
        }
    });
}

function purge(message) {
    message.guild.roles.cache.forEach((v, k, m) => {
        getRole(message, v.id)
            .then(role => {
                try {
                    if (role.id !== '488500539651391489' && role.id !== '641026182464143372') role.delete();
                }
                catch (e) { console.log(e) }
            })
            .catch(e => console.log(e));
    })
}

module.exports = {
    refresh_guild,
    refresh_user,
    add,
    remove,
    purge,
    setRole
}