const chatFormat = require('../../common/bot/helpers/global/chatFormat');
const Discord = require('discord.js');
const sql = require('../../sql/adapter');

function newCandidate(message, data) {
    if (!data.parameters.string.name)
        return {
            value: chatFormat.response.syntax.error('Missing parameter $name')
        };

    const guild_name = data.parameters.string.name;

    if (guild_name.length > 32)
        return {
            value: chatFormat.response.syntax.error('Name cannot be longer than 32 characters')
        };

    return new Promise((resolve, reject) => {
        sql.server.guilds.check(message, guild_name)
            .then(r => {
                if (r) { // Guild already exists
                    resolve({
                        value: chatFormat.response.guilds.create.already_exists(guild_name)
                    });
                } else {
                    sql.server.guilds.getByUser(message, message.author.id)
                        .then(list => {
                            if (list.length) // Member is already in a guild
                                resolve({
                                    value: chatFormat.response.guilds.create.already_member()
                                });
                            else
                                sql.server.guilds.create(message, data)
                                    .then(r => resolve(r))
                                    .catch(e => reject(e));
                        })

                }
            })
            .catch(e => reject(e));
    });
}

function guildEmbed(message, guild) {
    let embed = new Discord.MessageEmbed();

    return new Promise((resolve, reject) => {
        embed.setTitle(guild.name);
        embed.setColor(guild.color)

        let guild_users = [
            sql.server.guilds.getLeaders(message, guild.name),
            sql.server.guilds.getOfficers(message, guild.name),
            sql.server.guilds.getMembers(message, guild.name),
            sql.server.guilds.getExhiled(message, guild.name),
        ];

        Promise.all(guild_users)
            .then(arr => {
                const leaders = arr[0];
                const officers = arr[1];
                const members = arr[2];
                const exhiled = arr[3];

                let str_l = `Leader${leaders.length > 1 ? 's' : ''}:\n`;
                let str_r = `Officers\n`;

                for (let i in leaders)
                    str_l += `> ${leaders[i].guild_title ? leaders[i].guild_title + ' ' : ''}${message.guild.members.cache.get(leaders[i].user_id).user.username}\n`;

                if (officers.length)
                    for (let i in officers)
                        str_r += `> ${officers[i].guild_title ? officers[i].guild_title + ' ' : ''}${message.guild.members.cache.get(officers[i].user_id).user.username}\n`;
                else
                    str_r += '_no officers_\n';

                str_l += '\nMembers:\n';

                if (members.length && members.length <= 10)
                    for (let i in members)
                        str_l += `> ${members[i].guild_title ? members[i].guild_title + ' ' : ''}${message.guild.members.cache.get(members[i].user_id).user.username}\n`;
                else if (members.length > 10)
                    str_l += `${members.length} strong`;
                else
                    str_l += '_vaccant_\n';

                str_r += '\nExhiled:\n';

                if (exhiled.length && members.length <= 10)
                    for (let i in exhiled)
                        str_r += `> ${exhiled[i].guild_title ? exhiled[i].guild_title + ' ' : ''}${message.guild.members.cache.get(exhiled[i].user_id).user.username}\n`;
                else if (exhiled.length > 10)
                    str_r += `${exhiled.length} strong`;
                else
                    str_r += '_nobody_';

                embed.addField(`${guild.members} members${guild.limbo != 0 ? ' (in limbo)' : ''}`, str_l, true);
                embed.addField(`Requires invite: ${guild.invite_only ? 'Yes' : 'No'}`, str_r, true);

                embed.setDescription('"' + (JSON.parse(guild.text_assets).motto || 'Do you know, the muffin man?') + '"');
                if (guild.icon != 'null')
                    embed.setThumbnail(guild.icon);

                resolve({
                    embed
                });
            })
            .catch(e => reject(e));
    })
}

function formatListing(message, data) {
    return new Promise((resolve, reject) => {
        const guild_name = !data.parameters.string.name ? null : data.parameters.string.name.trim();

        if (!guild_name) {
            sql.server.guilds.getByUser(message, message.author.id)
                .then(guildList => {
                    if (guildList.length) {
                        const guild = guildList[0];
                        resolve(guildEmbed(message, guild));
                    } else {
                        resolve({
                            value: chatFormat.response.guilds.error.no_guild()
                        });
                    }
                })
                .catch(e => reject(e));
        } else {
            sql.server.guilds.getByName(message, guild_name)
                .then(guildList => {
                    if (guildList.length) {
                        const guild = guildList[0];
                        resolve(guildEmbed(message, guild));
                    } else {
                        resolve({
                            value: chatFormat.response.guilds.error.no_guild()
                        });
                    }
                })
                .catch(e => reject(e));
        }
    });
}

function setIcon(message, data) {
    if (!data.urls.length)
        return {
            value: chatFormat.response.guilds.icon.bad_url()
        };

    return new Promise((resolve, reject) => {
        sql.server.guilds.getByUser(message, message.author.id)
            .then(guildList => {
                if (guildList.length) {
                    const guild = guildList[0];
                    sql.server.guilds.isLeader(message, guild.name, message.author.id)
                        .then(r => {
                            if (r) {
                                sql.server.guilds.setIcon(message, data.urls[0])
                                    .then(r => resolve({ value: chatFormat.response.guilds.icon.success(guild.name) }))
                                    .catch(e => reject(e));
                            }
                            else
                                resolve({ value: chatFormat.response.guilds.icon.no_perms() })
                        })
                        .catch(e => reject(e));
                }
                else
                    resolve({ value: chatFormat.response.guilds.error.no_guild() })
            })
            .catch(e => reject(e));
    });
}

function setColor(message, data) {
    let regex = /#[a-f0-9]{6}/g;
    let color = message.content.match(regex);

    if (color === null)
        return {
            value: chatFormat.response.guilds.color.bad_hex()
        };

    return new Promise((resolve, reject) => {
        sql.server.guilds.getByUser(message, message.author.id)
            .then(guildList => {
                if (guildList.length) {
                    const guild = guildList[0];
                    sql.server.guilds.isLeader(message, guild.name, message.author.id)
                        .then(r => {
                            if (r) {
                                sql.server.guilds.setColor(message, color)
                                    .then(r => resolve({ value: chatFormat.response.guilds.color.success(guild.name) }))
                                    .catch(e => reject(e));
                            }
                            else
                                resolve({ value: chatFormat.response.guilds.color.no_perms() })
                        })
                        .catch(e => reject(e));
                }
                else
                    resolve({ value: chatFormat.response.guilds.error.no_guild() })
            })
            .catch(e => reject(e));
    })
}

function setLore(message, data) {
    return new Promise((resolve, reject) => {
        sql.server.guilds.getByUser(message, message.author.id)
            .then(guildList => {
                if (guildList.length) {
                    const guild = guildList[0];

                    sql.server.guilds.isLeader(message, guild.name)
                        .then(r => {
                            if (r) {
                                sql.server.guilds.setLore(message, guild.name, data.arguments.slice(1).join(' ').trim())
                                    .then(r => resolve({
                                        value: chatFormat.response.guilds.text_asset.lore.success(guild.name)
                                    }))
                                    .catch(e => reject(e));
                                }
                            else
                                resolve({
                                    value: chatFormat.response.guilds.text_asset.lore.no_perms()
                                })
                        })
                } else
                    resolve({
                        value: chatFormat.response.guilds.error.no_guild()
                    });
            })
            .catch(e => reject(e));
    });
}

function setMotto(message, data) {
    return new Promise((resolve, reject) => {
        sql.server.guilds.getByUser(message, message.author.id)
            .then(guildList => {
                if (guildList.length) {
                    const guild = guildList[0];

                    sql.server.guilds.isLeader(message, guild.name)
                        .then(r => {
                            if (r) {
                                sql.server.guilds.setMotto(message, guild.name, data.arguments.slice(1).join(' ').trim())
                                    .then(r => resolve({
                                        value: chatFormat.response.guilds.text_asset.motto.success(guild.name)
                                    }))
                                    .catch(e => reject(e));
                                }
                            else
                                resolve({
                                    value: chatFormat.response.guilds.text_asset.motto.no_perms()
                                });
                        })
                } else
                    resolve({
                        value: chatFormat.response.guilds.error.no_guild()
                    });
            })
            .catch(e => reject(e));
    });
}

function getLore(message, data) {
    return new Promise((resolve, reject) => {
        if (!data.parameters.string.name) {
            sql.server.guilds.getByUser(message, message.author.id)
                .then(guildList => {
                    if (guildList.length) {
                        const guild = guildList[0];

                        let embed = new Discord.MessageEmbed()
                            .setTitle(`The Lore of ${guild.name}`)
                            .addField('And thus it is written...', JSON.parse(guild.text_assets).lore || '...absolutely nothing is known about the guild. Mysterious.');

                        resolve({
                            embed
                        });
                    } else
                        resolve({
                            value: chatFormat.response.guilds.error.no_guild()
                        });
                })
                .catch(e => reject(e));
        } else {
            sql.server.guilds.getByName(message, data.parameters.string.name)
                .then(guildList => {
                    if (guildList.length) {
                        const guild = guildList[0];

                        let embed = new Discord.MessageEmbed()
                            .setTitle(`The Lore of ${guild.name}`)
                            .addField('And thus it is written...', JSON.parse(guild.text_asset).lore || '...absolutely nothing is known about the guild. Mysterious.');

                        resolve({
                            embed
                        });
                    } else
                        resolve({
                            value: chatFormat.response.guilds.error.not_found(data.parameters.string.name)
                        });
                })
                .catch(e => reject(e));
        }
    });
}

function list(message, data) {
    console.log(data);
    return new Promise((resolve, reject) => {
        sql.server.guilds.list(message)
            .then(list => {
                let embed = new Discord.MessageEmbed()
                    .setTitle(`Guilds in ${message.guild.name}`);

                let guild_list = [];

                for (let i in list) {
                    if ((data.flags['p'] && list[i].invite_only) || !list[i].invite_only) {
                        embed.addField(list[i].name, `${list[i].members} members${list[i].limbo != 0 ? ' (in limbo)' : ''}${list[i].invite_only ? '\nInvite only.' : ''}`);
                        guild_list.push(list[i]);
                    }
                }

                if (!guild_list.length)
                    embed.addField('There are no guilds in this server.', 'Use the "guild create" command to make some!');

                resolve({
                    embed
                });
            })
            .catch(e => reject(e));
    });
}

function join(message, data) {
    let guild_name = data.arguments.slice(1).join(' ').trim();

    return new Promise((resolve, reject) => {
        if (!guild_name)
            resolve({
                value: chatFormat.response.guilds.join.no_name()
            });
        else
            sql.server.guilds.getUserInvites(message, message.author.id, guild_name)
                .then(invites => {
                    sql.server.guilds.getByUser(message, message.author.id)
                        .then(guildList => {
                            if (guildList.length) {
                                resolve({
                                    value: chatFormat.response.guilds.join.already_member()
                                });
                            } else {
                                if (invites.length)
                                    sql.server.guilds.addMember(message, guild_name, message.author.id)
                                        .then(result => {
                                            console.log(result);
                                            if (result.status === true)
                                                resolve({
                                                    value: chatFormat.response.guilds.leave.success(message.author, guild.name)
                                                });
                                            else
                                                resolve({
                                                    values: [
                                                        { value: chatFormat.response.guilds.join.success(message.author, guild.name) },
                                                        result
                                                    ]
                                                });
                                        })
                                        .catch(e => reject(e));
                                else
                                    resolve({
                                        value: chatFormat.response.guilds.join.no_invite(guild_name)
                                    })
                            }
                        })
                })
                .catch(e => reject(e));
    });
}

function admin_join(message, data) {
    return new Promise((resolve, reject) => {
        if (!data.parameters.string.name || !data.mentions.members.size)
            resolve({
                value: chatFormat.response.syntax.error((!data.parameters.string.name) ? 'Missing parameter $name' : 'Missing mentioned member')
            });
        else {
            let arr = [];
            let members = [];
            data.mentions.members.forEach((v, k, m) => {
                arr.push(sql.server.guilds.addMember(message, data.parameters.string.name, k));
                members.push(v);
            });

            Promise.all(arr)
                .then(results => {
                    let values = [];
                    for (let i in results) {
                        console.log(results[i])
                        if (results[i].status === true) {
                            values.push({
                                value: chatFormat.response.guilds.join.success(members[i], data.parameters.string.name)
                            });

                        }
                        else {
                            values.push(results[i]);
                        }
                    }
                    resolve({
                        values
                    })
                })
                .catch(e => reject(e));
        }
    });
}

function admin_leave(message, data) {
    return new Promise((resolve, reject) => {
        if (!data.parameters.string.name || !data.mentions.members.size)
            resolve({
                value: chatFormat.response.syntax.error((!data.parameters.string.name) ? 'Missing parameter $name' : 'Missing mentioned member')
            });
        else {
            let arr = [];
            let members = [];
            data.mentions.members.forEach((v, k, m) => {
                arr.push(sql.server.guilds.removeMember(message, data.parameters.string.name, k));
                members.push(v);
            });

            Promise.all(arr)
                .then(results => {
                    let values = [];
                    for (let i in results) {
                        if (results[i].status === false)
                            values.push({
                                value: chatFormat.response.guilds.leave.success(members[i], data.parameters.string.name)
                            });
                        else {
                            values.push({ value: chatFormat.response.guilds.leave.success(members[i], data.parameters.string.name) });
                            values.push(results[i]);
                        }
                    }
                    resolve({
                        values
                    });
                })
                .catch(e => reject(e));
        }
    });
}

function admin_disband(message, data) {
    return new Promise((resolve, reject) => {
        if (!data.parameters.string.name)
            resolve({
                value: chatFormat.response.syntax.error('Missing parameter $name')
            });
        else
            sql.server.guilds.purge(message, data.parameters.string.name)
                .then(r => resolve({
                    value: chatFormat.response.guilds.admin.disbanded(data.parameters.string.name)
                }))
                .catch(e => reject(e));
    })
}

function leave(message, data) {
    return new Promise((resolve, reject) => {
        sql.server.guilds.getByUser(message, message.author.id)
            .then(guildList => {
                if (guildList.length) {
                    const guild = guildList[0];

                    sql.server.guilds.removeMember(message, guild.name, message.author.id)
                        .then(result => {
                            console.log(result);
                            if (result.status === false)
                                resolve({
                                    value: chatFormat.response.guilds.leave.success(message.author, guild.name)
                                });
                            else
                                resolve({
                                    values: [
                                        { value: chatFormat.response.guilds.leave.success(message.author, guild.name) },
                                        result
                                    ]
                                });
                        })
                        .catch(e => reject(e));
                } else {
                    resolve({
                        value: chatFormat.response.guilds.leave.no_guild()
                    });
                }
            })
            .catch(e => reject(e));
    });
}

function invite(message, data) {
    return new Promise((resolve, reject) => {
        if (!data.mentions.members.size)
            resolve({
                value: chatFormat.response.guilds.invite.no_users()
            });
        else if (data.mentions.members.size > 5) {
            resolve({
                value: chatFormat.response.guilds.invite.too_many_users()
            });
        } else {
            sql.server.guilds.getByUser(message, message.author.id)
                .then(guildList => {
                    const guild = guildList[0];

                    let users_arr = [
                        sql.server.guilds.getLeaders(message, guild.name),
                        sql.server.guilds.getOfficers(message, guild.name)
                    ];

                    Promise.all(users_arr)
                        .then(users => {
                            let leader_ids = users[0].reduce((arr, user) => {
                                if (user.user_id == message.author.id)
                                    arr.push(user.user_id);
                                return arr;
                            }, []);

                            let officer_ids = users[1].reduce((arr, user) => {
                                if (user.user_id == message.author.id)
                                    arr.push(user.user_id);
                                return arr;
                            }, []);

                            if (leader_ids.length || officer_ids.length) {
                                let invites = [];
                                data.mentions.members.forEach((v, k, m) => {
                                    invites.push(sql.server.guilds.inviteMember(message, guild.name, k));
                                })

                                Promise.all(invites)
                                    .then(results => resolve({
                                        values: results
                                    }))
                                    .catch(e => reject(e));
                            }
                        })
                        .catch(e => {
                            reject(e);
                        });
                });
        }
    });
}

function toggleInvites(message, data) {
    return new Promise((resolve, reject) => {
        sql.server.guilds.getByUser(message, message.author.id)
            .then(guildList => {
                if (guildList.length) {
                    const guild = guildList[0];

                    sql.server.guilds.isLeader(message, guild.name)
                        .then(r => {
                            if (r) {
                                sql.server.guilds.toggleInvites(message, guild)
                                    .then(r => resolve(r))
                                    .catch(e => reject(e));
                            } else
                                resolve({
                                    value: chatFormat.response.guilds.invite.toggle_no_perms()
                                });
                        })
                        .catch(e => reject(e));
                } else
                    resolve({
                        value: chatFormat.response.guilds.error.no_guild()
                    });
            })
            .catch(e => reject(e));
    });
}

function deleteInvite(message, data) {
    return new Promise((resolve, reject) => {
        if (!data.parameters.string.name)
            resolve({
                value: chatFormat.response.syntax.error('Missing parameter $name')
            });
        else {
            sql.server.guilds.deleteInvite(message.guild.id, data.parameters.string.name, message.author.id)
                .then(r => resolve({
                    value: chatFormat.response.guilds.invite.reject(message.author.username, data.parameters.string.name)
                }))
                .catch(e => reject(e));
        }
    });
}

function getInvites(message, data) {
    return new Promise((resolve, reject) => {
        if (data.parameters.string.name) {

        } else {
            sql.server.guilds.getByUser(message, message.author.id)
                .then(guildList => {
                    if (guildList.length) {
                        resolve({
                            value: chatFormat.response.guilds.invite.get.already_member()
                        });
                    } else {
                        sql.server.guilds.getUserInvites(message, message.author.id)
                            .then(invites => {
                                let embed = new Discord.MessageEmbed()
                                    .setTitle(`Guild Invites for ${message.author.username}`)
                                    .setColor(chatFormat.colors.information);

                                let str = '';
                                if (invites.length) {
                                    let count = 0;
                                    while (count < invites.length) {
                                        str += `${count + 1}. ${invites[count].guild_name}\n`;
                                        count++;
                                    }
                                } else
                                    str = 'No available invites.';

                                embed.addField('List:', str);

                                resolve({
                                    embed
                                });
                            })
                            .catch(e => reject(e));
                    }
                })
                .catch(e => reject(e));
        }
    })
}

function update(message, guild_name) {
    return sql.server.guilds.updateMembers(message, guild_name);
}

function promote(message, data, role) {
    return new Promise((resolve, reject) => {
        sql.server.guilds.getByUser(message, message.author.id)
            .then(guilds => {
                if (guilds.length) {
                    const guild_name = guilds[0].name;

                    sql.server.guilds.isLeader(message, guild_name, message.author.id)
                        .then(r => {
                            if (r) {
                                if (data.mentions.members.size > 0) {
                                    sql.server.guilds.setUserRole(message, data.mentions.members.first().id, role)
                                        .then(r => resolve(r))
                                        .catch(e => reject(e));
                                } else
                                    resolve({
                                        value: chatFormat.response.guilds.role.promote.no_user()
                                    });
                            } else
                                resolve({
                                    value: chatFormat.response.guilds.role.no_perms()
                                });
                        })
                        .catch(e => reject(e));
                } else
                    resolve({
                        value: chatFormat.response.guilds.error.no_guild()
                    })
            })
            .catch(e => reject(e));
    });
}

function setTitle(message, data) {
    return new Promise((resolve, reject) => {
        sql.server.guilds.getByUser(message, message.author.id)
            .then(guilds => {
                if (guilds.length) {
                    const guild_name = guilds[0].name;

                    sql.server.guilds.isLeader(message, guild_name, message.author.id)
                        .then(r => {
                            if (r) {
                                if (data.mentions.members.size > 0) {
                                    let arr = [];
                                    data.mentions.members.forEach((v, k, m) => {
                                        arr.push(sql.server.guilds.setUserTitle(message, guild_name, k, data.parameters.string.title || ''));
                                    });

                                    Promise.all(arr)
                                        .then(results => resolve({
                                            values: results
                                        }))
                                        .catch(e => reject(e));
                                } else
                                    resolve({
                                        value: chatFormat.response.guilds.role.promote.no_user()
                                    });
                            } else
                                resolve({
                                    value: chatFormat.response.guilds.role.no_perms()
                                });
                        })
                        .catch(e => reject(e));
                } else
                    resolve({
                        value: chatFormat.response.guilds.error.no_guild()
                    })
            })
            .catch(e => reject(e));
    });
}

module.exports = {
    create: sql.server.guilds.create,
    get: sql.server.guilds.get,
    view: formatListing,

    setIcon,
    setColor,
    setLore,
    setMotto,
    promote,
    setTitle,

    newCandidate,
    list,
    join,
    leave,
    update,
    invite,
    getInvites,
    deleteInvite,
    getLore,
    toggleInvites,

    admin_join,
    admin_leave,
    admin_disband
}