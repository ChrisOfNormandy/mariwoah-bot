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
            user: (user, userMessagesDeleted) => {return `Deletion of messages successful. Total messages deleted for user ${user}: ${userMessagesDeleted}`},
            all: (botMessagesDeleted, cmdMessagesDeleted) => {return `Deletion of messages successful. Total messages deleted:\nBot spam: ${botMessagesDeleted}\nCommands: ${cmdMessagesDeleted}`}
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
                end: () => {return `> End of queue.`}
            },
            getSong: {
                playlist: () => {return `Please wait while I fetch all the songs in the playlist.`}
            },
            playlist: {
                no_data: () => {return `> There are no songs in the selected playlist.`}
            },
            info: {
                error: () => {return `> Encountered error finding song information.`}
            },
            play: {
                error: (title) => {return `Had an issue playing ${title || 'an undefined song'}.`}
            },
            pause: {
                no_stream: () => {return `> No active stream.`},
                yes: () => {return `> :pause_button: Paused.`},
                no: () => {return `> Resuming.`}
            }
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
            setRole: (name, role) => {return `Set the role for ${name} to ${role}`},
            verifyPermission: (level) => {return `You must be level ${level} to use that command.`}
        }
    }
}