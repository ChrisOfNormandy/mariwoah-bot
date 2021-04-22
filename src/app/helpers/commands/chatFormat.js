module.exports = {
    colors: {
        youtube: '#990011',
        information: '#224466',
        byName: {
            lightred: '#ff6666',
            red: '#ff0000',
            darkred: '#990000',
            lightorage: '#ffc266',
            orange: '#ff9900',
            darkorange: '#995c00',
            lightyellow: '#ffff66',
            yellow: '#ffff00',
            darkyellow: '#999900',
            lightgreen: '#66ff66',
            green: '#00ff00',
            darkgreen: '#009900',
            lightblue: '#6666ff',
            blue: '#0000ff',
            darkblue: '#000099',
            lightpurple: '#e066ff',
            purple: '#cc00ff',
            darkpurple: '#7a0099',
            white: '#ffffff',
            lightgray: '#b3b3b3',
            gray: '#808080',
            darkgray: '#4d4d4d',
            black: '#000000',
            brown: '#996600',
            cyan: '#009999',
            aqua: '#00ffff',
            lightpink: '#ff66ff',
            pink: '#ff00ff',
            darkpink: '#990099'
        }
    },
    response: {
        cleanChat: {
            user: (user, userMessagesDeleted) => {return `> Deletion of messages successful. Total messages deleted for user ${user}: ${userMessagesDeleted}`},
            all: (botMessagesDeleted, cmdMessagesDeleted) => {return `> Deletion of messages successful. Total messages deleted:\nBot spam: ${botMessagesDeleted}\nCommands: ${cmdMessagesDeleted}`}
        },
        whoAre: {
            self_reject: () => {return `> Failed to gather user data.`},
            member_reject: () => {return `> Failed to gather user data.`}
        },
        music: {
            no_vc: () => {return `> You must be in a voice channel to use this feature.`},
            join: {
                error: () => {return `> Failed to join voice channel.`}
            },
            stop: {
                plain: () => {return `> Stopping all music.`},
                no_queue: () => {return `> Nothing to stop.`}
            },
            skip: {
                plain: () => {return `> Skipping...`},
                no_queue: () => {return `> Nothing to skip.`}
            },
            queue: {
                no_data: () => {return `> There are no songs in the queue.`},
                no_active: () => {return `> No active queue.`},
                end: () => {return `> End of queue.`},
                list_length: 10
            },
            getSong: {
                playlist: () => {return `> Please wait while I fetch all the songs in the playlist.`},
                playlist_result: (playlist) => {return `> Found ${playlist.title} with ${playlist.videos.length} videos by ${playlist.author.name}.`},
                playlist_undefined: (id) => {return `> Failed to fetch the playlist from YouTube with the id ${id}.\n> Attempting to fetch a similar playlist...`}
            },
            playlist: {
                no_data: () => {return `> There are no songs in the selected playlist.`}
            },
            info: {
                error: () => {return `> Encountered error finding song information.`}
            },
            play: {
                error: (title) => {return `> Had an issue playing ${title || 'an undefined song'}.`}
            },
            pause: {
                no_stream: () => {return `> No active stream.`},
                yes: () => {return `> :pause_button: Paused.`},
                no: () => {return `> Resuming.`}
            },
            timeout: (obj) => {return `Timed out searching for ${obj}.`}
        },
        punish: {
            no_user: () => {return `> Could not find target user.`},
            ban: (user, reason, count) => {return `> Banned ${user} for reason: ${reason}\n> Currently has ${count} bans.`},
            kick: (user, reason, count) => {return `> Kicked ${user} for reason: ${reason}\n> Currently has ${count} kicks.`},
            warn: (user, reason, count) => {return `> Warned ${user} for reason: ${reason}\n> Currently has ${count} warnings.`}
        },
        roles: {
            promote: (user, level) => {return `> Promoted ${user} to level ${level}.`},
            no_promote: (user, level) => {return `> Cannot promote ${user} any higher than admin, level ${level}.`},
            fail_promote: () => {return `> Failed to promote user.`},
            demote: (user, level) => {return `> Demoted ${user} to level ${level}.`},
            no_demote: (user, level) => {return `> Cannot demote ${user} any lower than default, level ${level}.`},
            fail_demote: () => {return `> Failed to demote user.`},
            refresh_guild: (count, total) => {return `> Altered ${count} / ${total} users.`},
            refresh_user_yes: () => {return `> Altered user successfully.`},
            refresh_user_no: () => {return `> Didn't alter user, everything is fine.`},

            setRank: {
                botRole_no: (user, rank) => {return `> ${user} is already a bot ${rank}.`},
                botRole: (user, rank) => {return `> Moved ${user} to the bot ${rank} group.`},
                botRole_error: () => {return `> Failed to move member to role group due to error.`}
            },

            check: {
                error: (name, id) => {return `> Could not fetch the ${name} role with the id: ${id}.\n`}
            },
            setRole: (name, role) => {return `> Set the role for ${name} to ${role}`},
            verifyPermission: (level) => {return `> You must be level ${level} to use that command.`}
        },
        guilds: {
            create: {
                success: (guild_name) => {return `> Your guild, ${guild_name}, is now in limbo.\n> It will be fully established when there are at least 3 total members.`},
                already_exists: (guild_name) => {return `> ${guild_name} has already been established.`},
                already_member: () => {return `> You cannot create a new guild as a member of an active guild.`},
                establish: (guild_name, memberCount) => {return `> ${guild_name} is now an established guild with ${memberCount} total members!`},
                undo: (guild_name, memberCount) => {return `> ${guild_name} is in limbo with only ${memberCount} members.\n> If it loses all members or its leader, it will be abolished.`}
            },
            join: {
                no_name: () => {return '> You must provide the name of the guild you wish to join.'},
                already_member: () => {return `> You cannot join a guild while you are already a guild member.`},
                success: (user, guild_name) => {return `> ${user} has joined ${guild_name}!`},
                not_found: (guild_name) => {return `> There are no guilds named ${guild_name} in this server.`},
                no_invite: (guild_name) => {return `> ${guild_name} is an invite-only guild.\n> You must first be invited to join.\n> \n> You can check invites using the "guild invites" command.`},
                no_change: () => {return `> Nothing was changed.`}
            },
            leave: {
                success: (user, guild_name) => {return `> ${user} has left ${guild_name}!`},
                not_found: (guild_name) => {return `> There are no guilds named ${guild_name} in this server.`},
                no_guild: () => {return `> You must first be in a guild to leave.`}
            },
            icon: {
                success: (guild_name) => {return `> Successfully changed the guild icon for ${guild_name}.`},
                bad_url: () => {return `> You must provide a valid URL for an icon image.`},
                no_perms: () => {return `> You must be a guild leader to change the guild icon.`}
            },
            color: {
                success: (guild_name) => {return `> Successfully changed the guild color for ${guild_name}.`},
                bad_hex: () => {return `> You must provide a valid hex color for a guild color.\n> Example: #ffffff = white, #000000 = black`},
                no_perms: () => {return `> You must be a guild leader to change the guild color.`}
            },
            text_asset: {
                lore: {
                    success: (guild_name) => {return `> Successfully changed the guild lore for ${guild_name}.`},
                    no_perms: () => {return `> You must be a guild leader to change the guild color.`}
                },
                motto: {
                    success: (guild_name) => {return `> Succesfully chanced the guild motto for ${guild_name}.`},
                    no_perms: () => {return `> You must be a guild leader to change the guild color.`}
                }
            },
            role: {
                success: (username, role) => {return `> Changed the guild role for ${username} to ${role}.`},
                error: (role) => {return `> Invalid role name "${role}". Should be one of the following:\nleader, officer, member, exhiled.`},
                promote_leader: (username, guild_name) => {return `> ${username} has been promoted to a leader of ${guild_name}.`},
                no_perms: () => {return `> You must be a guild leader to change the roles of the guild.`},
                limit: () => {return `> Cannot create a new role, limit has been reached for this server (50 per 48 hours).`},
                reserved: (role_name) => {return `> The role ${role_name} is reserved and will not be reassigned.`},
                promote: {
                    exhile: (user, guild_name) => {return `> Exiled ${user} within ${guild_name}. They are a member, but at what cost?`},
                    member: (user, guild_name) => {return `> Updated ${user} to the role of guild member in ${guild_name}.`},
                    officer: (user, guild_name) => {return `> Updated ${user} to the role of guild officer in ${guild_name}.`},
                    leader: (user, guild_name) => {return `> Updated ${user} to the role of guild leader in ${guild_name}.`},
                    no_user: () => {return `You must ping a user to set their role.`}
                }
            },
            delete: {
                abandoned: (guild_name) => {return `> Deleted the guild ${guild_name} for being abandoned.`},
                no_leader: (guild_name) => {return `> Deleted the guild ${guild_name} for a lack of leadership.`},
                not_found: (guild_name) => {return `> Could not delete ${guild_name} as it could not be found.`}
            },
            invite: {
                success: (username, guild_name) => {return `> Invited ${username} to ${guild_name}.`},
                duplicate: (username) => {return `> An invite has already been extended to ${username}.`},
                not_found: (username, guild_name) => {return `> Could not find an invite from ${guild_name} to ${username}.`},
                reject: (username, guild_name) => {return `> ${username} has turned down the invite from ${guild_name}.`},
                no_users: () => {return `> You must ping users to invite them.`},
                too_many_users: () => {return `> You can only invite a maximum of 5 members at one time.`},
                toggle: (guild_name, value) => {return `> Changed the invite requirement for ${guild_name} to ${value}.`},
                toggle_no_perms: () => {return `You must be a guild leader to change the invite status of the guild.`},
                get: {
                    already_member: () => {return `> You are already in a guild.\n> To see invites to other guilds you must leave your current.`}
                }
            },
            admin: {
                disbanded: (guild_name) => {return `> Disbanded ${guild_name}.`}
            },
            error: {
                no_guild: () => {return `> You are not part of a guild.`},
                not_found: (guild_name) => {return `> Could not find a guild named ${guild_name}.`}
            }
        },
        syntax: {
            error: (str = null) => {return `> Check syntax ${str !== null ? `: ${str}` : '.'}`}
        }
    },
    capFormat: (s) => {
        return s.split('_').map(s => { return s.charAt(0).toUpperCase() + s.slice(1) }).join(' ');
    }
}