const chatFormat = require('../../common/bot/helpers/global/chatFormat');
const Discord = require('discord.js');
const sql = require('../../sql/adapter');

function newCandidate(message, data) {
    if (!data.parameters.string.name)
        return {
            value: 'Check syntax.'
        };

    return new Promise((resolve, reject) => {
        sql.server.guilds.check(message, data.parameters.string.name)
            .then(r => {
                if (r) {
                    resolve({
                        value: 'That guild already exists.'
                    });
                } else {
                    sql.server.guilds.create(message, data)
                        .then(r => resolve(r))
                        .catch(e => reject(e));
                }
            })
            .catch(e => reject(e));
    });
}

function formatListing(message, data) {
    let embed = new Discord.MessageEmbed();
    return new Promise((resolve, reject) => {
        if (!data.parameters.string.name) {
            sql.server.guilds.getByUser(message, message.author.id)
                .then(guildList => {
                    if (guildList.length) {
                        const guild = guildList[0];
                        embed.setTitle(guild.name);
                        embed.setColor(guild.color)

                        let guild_users = [
                            sql.server.guilds.getLeaders(message, guild.name),
                            sql.server.guilds.getOfficers(message, guild.name),
                            sql.server.guilds.getMembers(message, guild.name),
                            sql.server.guilds.getExhiled(message, guild.name)
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
                                        str_r += `${officers[i].guild_title ? officers[i].guild_title + ' ' : ''}${message.guild.members.cache.get(officers[i].user_id).user.username}\n`;
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

                                if (guild.icon != 'null')
                                    embed.setThumbnail(guild.icon);

                                resolve({
                                    embed
                                });
                            })
                            .catch(e => reject(e));

                    } else {
                        resolve({
                            value: '> You are not part of a guild.'
                        })
                    }
                })
                .catch(e => reject(e));
        } else {
            sql.server.guilds.get(message, data)
                .then(guild => {
                    embed.setTitle(guild.name);

                    // embed.addField(`Leader: ${message.guild.members.cache.get(guild.leader_id).user.username}`, 'yes');

                    if (guild.icon != 'null')
                        embed.setThumbnail(guild.icon);

                    resolve({
                        embed
                    })
                })
                .catch(e => reject(e));
        }
    });
}

function setIcon(message, data) {
    return (data.urls.length) ?
        sql.server.guilds.setIcon(message, data.urls[0]) : {
            value: 'You must provide a valid URL for an icon image.'
        };
}

function setColor(message, data) {
    let regex = /#[a-f0-9]{6}/g;
    let color = message.content.match(regex);
    if (color.length)
        return sql.server.guilds.setColor(message, color[0]);
    else
        return {value: 'You must provide a valid hex color for a guild color.\nExample: #ffffff = white, #000000 = black'};
}

function list(message, data) {
    return new Promise((resolve, reject) => {
        sql.server.guilds.list(message)
            .then(list => {
                let embed = new Discord.MessageEmbed()
                    .setTitle(`Guilds in ${message.guild.name}`);

                if (list.length)
                    for (let i in list) {
                        embed.addField(list[i].name, `${list[i].members} members${list[i].limbo != 0 ? ' (in limbo)' : ''}`);
                    }
                else
                    embed.addField('There are no guilds in this server.', 'Use the "guild create" command to make some!');

                resolve({
                    embed
                });
            })
            .catch(e => reject(e));
    });
}

function join(message, data) {
    let guild_name = data.arguments.slice(1).join(' ');
    return new Promise((resolve, reject) => {
        sql.server.guilds.addMember(message, guild_name, message.author.id)
            .then(r => resolve({
                value: (r) ? `> ${message.author} has joined ${guild_name}!` : `There are no guilds named ${guild_name} in this server.`
            }))
            .catch(e => reject(e));
    });
}

function leave(message, data) {
    return new Promise((resolve, reject) => {
        sql.server.guilds.getByUser(message, message.author.id)
            .then(guildList => {
                if (guildList.length) {
                    const guild = guildList[0];

                    sql.server.guilds.removeMember(message, guild.name, message.author.id)
                        .then(r => {
                            if (r != null)
                                resolve({
                                    values: [{
                                        value: `> ${message.author} has left ${guild.name}!`
                                    }, r]
                                });
                            else
                                resolve({
                                    value: `> ${message.author} has left ${guild.name}!`
                                });
                        })
                        .catch(e => reject(e));
                } else {
                    resolve({
                        value: '> You must first be in a guild to leave.'
                    });
                }
            })
            .catch(e => reject(e));
    });
}

function refreshGuild(message, data) {
    sql.server.getUserGuild(sql.con, message, message.author.id)
        .then(guild => {})
}



module.exports = {
    create: sql.server.guilds.create,
    get: sql.server.guilds.get,
    view: formatListing,

    setIcon,
    setColor,

    newCandidate,
    list,
    join,
    leave
}