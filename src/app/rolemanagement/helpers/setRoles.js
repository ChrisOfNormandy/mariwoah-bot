const sql = require('../../sql/adapter');
const roles = require('../../sql/helpers/servers/roles');
const chatFormat = require('../../common/bot/helpers/global/chatFormat');
const timeouts = require('../../sql/helpers/servers/timeout');

function checkRole(message, name, id) {
    return new Promise((resolve, reject) => {
        if (message.guild.roles.cache.has(id)) {
            message.guild.roles.fetch(id)
                .then(role => resolve({ name, id: role.id }))
                .catch(e => reject(e));
        }
        else {
            message.channel.send(chatFormat.response.roles.check.error(name, id));
            reject(id);
        }
    });
}

function refresh(message, member, roleMap, strip = false) {
    return new Promise((resolve, reject) => {
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

                if (strip) {
                    if (admin) remove(message, member, roleMap.admin)
                    if (mod) remove(message, member, roleMap.mod);
                    if (helper) remove(message, member, roleMap.helper);
                    if (vip) remove(message, member, roleMap.vip);
                    if (bot) remove(message, member, roleMap.bot);
                    resolve(true);
                }
                else {
                    if (member.user.bot) {
                        if (admin) remove(message, member, roleMap.admin)
                        if (mod) remove(message, member, roleMap.mod);
                        if (helper) remove(message, member, roleMap.helper);
                        if (vip) remove(message, member, roleMap.vip);

                        if (!bot)
                            add(message, member, roleMap.bot)
                                .then(r => resolve(true))
                                .catch(e => reject(e));
                        else
                            resolve(null);
                    }
                    else {
                        if (!admin && member.hasPermission("ADMINISTRATOR")) {
                            if (mod) remove(message, member, roleMap.mod).catch(e => console.log(e));
                            if (helper) remove(message, member, roleMap.helper).catch(e => console.log(e));
                            if (vip) remove(message, member, roleMap.vip).catch(e => console.log(e));
                            add(message, member, roleMap.admin)
                                .then(r => resolve(true))
                                .catch(e => reject(e));
                        }
                        else if (level == 0) {
                            if (admin) remove(message, member, roleMap.admin).catch(e => console.log(e));
                            if (mod) remove(message, member, roleMap.mod).catch(e => console.log(e));
                            if (helper) remove(message, member, roleMap.helper).catch(e => console.log(e));
                            if (vip) remove(message, member, roleMap.vip).catch(e => console.log(e));
                            if (admin || mod || helper || vip)
                                resolve(true);
                            else
                                resolve(null);
                        }
                        else if (!vip && level == 1) {
                            if (admin) remove(message, member, roleMap.admin).catch(e => console.log(e));
                            if (mod) remove(message, member, roleMap.mod).catch(e => console.log(e));
                            if (helper) remove(message, member, roleMap.helper).catch(e => console.log(e));
                            add(message, member, roleMap.vip)
                                .then(r => resolve(true))
                                .catch(e => reject(e));
                        }
                        else if (!helper && level == 2) {
                            if (admin) remove(message, member, roleMap.admin).catch(e => console.log(e));
                            if (mod) remove(message, member, roleMap.mod).catch(e => console.log(e));
                            if (vip) remove(message, member, roleMap.vip).catch(e => console.log(e));
                            add(message, member, roleMap.helper)
                                .then(r => resolve(true))
                                .catch(e => reject(e));
                        }
                        else if (!mod && level == 3) {
                            if (admin) remove(message, member, roleMap.admin).catch(e => console.log(e));
                            if (helper) remove(message, member, roleMap.helper).catch(e => console.log(e));
                            if (vip) remove(message, member, roleMap.vip).catch(e => console.log(e));
                            add(message, member, roleMap.mod)
                                .then(r => resolve(true))
                                .catch(e => reject(e));
                        }
                        else if (!admin && level == 4) {
                            if (mod) remove(message, member, roleMap.mod).catch(e => console.log(e));
                            if (helper) remove(message, member, roleMap.helper).catch(e => console.log(e));
                            if (vip) remove(message, member, roleMap.vip).catch(e => console.log(e));
                            add(message, member, roleMap.admin)
                                .then(r => resolve(true))
                                .catch(e => reject(e));
                        }
                        else
                            resolve(null);
                    }
                }
            })
            .catch(e => reject(e));
    });
}

function refresh_user(message, member) {
    return new Promise((resolve, reject) => {
        roles.get(message.guild.id)
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

                        refresh(message, member, roles)
                            .then(r => resolve({value: (r) ? chatFormat.response.roles.refresh_user_yes() : chatFormat.response.roles.refresh_user_no()}))
                    })
                    .catch((err) => reject(err));
            })
            .catch(e => reject(e));
    });
}

function refresh_guild(message, strip = false) {
    return new Promise((resolve, reject) => {
        roles.get(message.guild.id)
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
                            toResolve.push(refresh(message, member, roles, strip));
                        });

                        Promise.all(toResolve)
                            .then(results => {
                                let val = results.filter(v => v == true).length;
                                resolve({value: chatFormat.response.roles.refresh_guild(val, results.length)})
                            })
                            .catch(e => reject(e));
                    })
                    .catch((err) => reject(err));
            });
    });
}

function add(message, member, roleID) {
    return new Promise((resolve, reject) => {
        if (!message.guild.roles.cache.has(roleID))
            reject(false);
        else
            message.guild.roles.fetch(roleID)
                .then(role => {
                    member.roles.add(message.guild.roles.resolve(role))
                        .then(r => resolve(r))
                        .catch(e => reject(e));
                })
                .catch(e => reject(e));
    });
}

function remove(message, member, roleID) {
    return new Promise((resolve, reject) => {
        if (!message.guild.roles.cache.has(roleID))
            reject(false);
        else
            message.guild.roles.fetch(roleID)
                .then(role => {
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
            sql.server.roles.set(message.guild.id, name, role.id)
                .then(r => resolve({value: chatFormat.response.roles.setRole(name, role), r}))
                .catch(e => reject(e));
        }
        else {
            reject(role);
        }
    });
}

function createByData(message, data) {
    return new Promise((resolve, reject) => {
        
    })
}

function create(message, name, color, reason = 'Automated creation') {
    console.log('Creating a new role: ', name)
    let role = null;

    message.guild.roles.cache.forEach((v, k, m) => {
        if (v.name == name)
            role = v;
    });

    return new Promise((resolve, reject) => {
        roles.get(message.guild.id)
            .then(roles => {
                if (role !== null) {
                    switch (role.id) {
                        case roles.admin: { }
                        case roles.mod: { }
                        case roles.helper: { }
                        case roles.vip: { }
                        case roles.bot: {
                            role = 'FAKE';
                        }
                    }
                    console.log('Role is not reserved.')

                    if (role !== 'FAKE') {
                        message.guild.roles.fetch(role.id)
                            .then(role => {
                                message.guild.roles.resolve(role).setColor(color)
                                    .then(role => role.setHoist(true).then(role => role.setMentionable(true).then(role => resolve(role))));
                            })
                            .catch(e => reject(e));
                    }
                }

                timeouts.checkRole_upTick(message)
                    .then(valid => {
                        console.log(valid);
                        if (valid) {
                            let role_name = (role === 'FAKE')
                                ? `FAKE - ${name}`
                                : name;
                            if (role_name.length > 32)
                                role_name = role_name.slice(-1 * (role_name.length - 32));

                            message.guild.roles.create({
                                data: {
                                    name: role_name,
                                    color
                                },
                                reason
                            })
                                .then(role => {
                                    role.setHoist(true)
                                        .then(role => {
                                            role.setMentionable(true)
                                                .then(role => resolve(role))
                                                .catch(e => reject(e));
                                        })
                                        .catch(e => reject(e));
                                })
                                .catch(e => reject(e));
                        }
                        else {
                            resolve({ value: chatFormat.response.guilds.role.limit() })
                        }
                    })
                    .catch(e => reject(e));
            })
            .catch(e => reject(e));
    });
}

function purge(message) {
    message.guild.roles.cache.forEach((v, k, m) => {
        getRole(message, v.id)
            .then(role => {
                try {
                    if (role.id !== '488500539651391489' && role.id !== '641026182464143372')
                        role.delete();
                }
                catch (e) {
                    console.log(e);
                }
            })
            .catch(e => console.log(e));
    });
}

module.exports = {
    refresh_guild: (message) => refresh_guild(message),
    reset_guild: (message) => refresh_guild(message, true),
    refresh_user,
    create,
    createByData,
    add,
    remove,
    purge,
    setRole
}