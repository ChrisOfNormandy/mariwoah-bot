const adapter = require('./app/adapter');

module.exports = {
    // Common
    "help": {
        context: "common",
        description: "List command help and syntaxes.",
        syntax: "{c}",
        permissionLevel: 0,
        arguments: [],
        properties: [],
        alternatives: ['?'],
        flags: [],
        settings: {
            "commandClear": {
                delay: 0
            },
            "responseClear": {
                delay: 30
            }
        },
        enabled: true,
        run: (message, data) => adapter.common.bot.features.listHelp(message, data.arguments)
    },
    "clean": {
        context: "utility",
        description: "Cleans chat of bot messages and commands. Can be used to clean specific user messages.",
        syntax: "{c} {*0}",
        permissionLevel: 3,
        arguments: [
            {"*@User(s)": "User ping(s)."}
        ],
        properties: [],
        alternatives: ['clear'],
        flags: [],
        settings: {
            "responseClear": {
                delay: 10
            }
        },
        enabled: true,
        run: (message, data) => adapter.common.bot.features.cleanChat(message)
    },
    "fetchemoji": {
        context: "vanity",
        description: "Fetches an emoji, by name, from host servers.",
        syntax: "{c} {0}",
        permissionLevel: 0,
        arguments: [
            {"emoji": "The name of the emoji, such as 'trash'."}
        ],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.common.bot.features.fetchEmoji(message, data)
    },
    "imgur": {
        context: "vanity",
        description: "Searches Imgur for a specified tag image.",
        syntax: "{c} {0}",
        permissionLevel: 0,
        arguments: [
            {"tag": "The tag to search for on Imgur."}
        ],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {
            "commandClear": {
                delay: 0
            }
        },
        enabled: true,
        run: (message, data) => adapter.imgur.search(data)
    },
    "ping": {
        context: "common",
        description: "Gauge Discord's message latency.",
        syntax: "{c}",
        permissionLevel: 0,
        arguments: [],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {
            "commandClear": {
                delay: 0
            }
        },
        enabled: true,
        run: (message, data) => adapter.common.bot.features.ping(message)
    },
    "roll": {
        context: "common",
        description: "Rolls a number between 1 and a given value, default 6. Can be done multiple times.",
        syntax: "{c} {*0} {+1}",
        permissionLevel: 0,
        arguments: [
            {"*Sides": "The number to roll to, default being 6."},
            {"*Count": "How many rolls should be made. Requires sides declairation. Max 50."}
        ],
        properties: [],
        alternatives: ['r'],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.common.bot.features.roll(data.arguments)
    },
    "shuffle": {
        context: "common",
        description: "Shuffles a set of csv values.",
        syntax: "{c} {0}",
        permissionLevel: 0,
        arguments: [
            {"List": "Comma separated values list - ex: 1,2,3,4,5"}
        ],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => {
            return new Promise((resolve, reject) => {
                adapter.common.bot.global.shuffle(data.arguments[0].split(','))
                    .then(arr => resolve({values: arr, content: [arr.join(', ')]}))
                    .catch(e => reject({rejections: [e], content: []}));
            });
        }
    },
    "whoami": {
        context: "server",
        description: "Gathers and displays information about yourself.",
        syntax: "{c}",
        permissionLevel: 0,
        arguments: [],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {
            "commandClear": {
                delay: 0
            },
            "responseClear": {
                delay: 30
            }
        },
        enabled: true,
        run: (message, data) => adapter.common.bot.features.whoAre.self(message)
    },
    "whoareyou": {
        context: "server",
        description: "Gathers and displays information about another user.",
        syntax: "{c} {0}",
        permissionLevel: 1,
        arguments: [
            {"@User": "User ping."}
        ],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {
            "commandClear": {
                delay: 0
            },
            "responseClear": {
                delay: 30
            }
        },
        enabled: true,
        run: (message, data) => adapter.common.bot.features.whoAre.member(message)
    },
    "setmotd": {
        context: "server",
        description: "Set the server Message of the Day / Information.",
        syntax: "{c} {0}",
        permissionLevel: 4,
        arguments: [
            {"MOTD": "A stringified JSON Discord.MessageEmbed object. See: https://discordjs.guide/popular-topics/embeds.html"}
        ],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.common.bot.features.motd.set(message, data)
    },
    "motd": {
        context: "server",
        description: "Get the server Message of the Day / Information.",
        syntax: "{c}",
        permissionLevel: 0,
        arguments: [],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.common.bot.features.motd.get(message, data.parameters)
    },
    "setprefix": {
        context: "server",
        description: "Define an alternative prefix (default ~) for bot commands.",
        syntax: "{c} {0}",
        permissionLevel: 4,
        arguments: [
            {"Prefix": "Any standard keyboard character / symbol."}
        ],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.common.bot.features.prefix.set(message, data.arguments[0])
    },
    "prefix": {
        context: "server",
        description: "Get the alternative command prefix.",
        syntax: "{c}",
        permissionLevel: 0,
        arguments: [],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.common.bot.features.prefix.get(message)
    },

    // Google Search
    "find": {
        context: "vanity",
        description: "",
        syntax: "",
        permissionLevel: 1,
        arguments: [],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {},
        enabled: false,
        run: (message, data) => adapter.google.post(data)
    },
    "bing": {
        context: "vanity",
        description: "Search Bing images for some image results. Will return a random image from the fetched results.",
        syntax: "{c} {0}",
        permissionLevel: 1,
        arguments: [
            {"Query": "Search string, so whatever you would type in the search bar."}
        ],
        properties: [
            {"^results": "How many images to pick from."},
            {"^post": "How many images to return."}
        ],
        alternatives: [],
        flags: [
            {"n": "safeSearch = off"},
            {"g": "search for animated images (gifs) only."}
        ],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.bing.search(data)
    },
    "ff": {
        context: "game",
        description: "Fifty/Fifty. Not super great, mostly porn, but yeah.",
        syntax: "{c}",
        permissionLevel: 1,
        arguments: [],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {
            "commandClear": {
                delay: 0
            }
        },
        enabled: true,
        run: (message, data) => adapter.bing.fiftyfifty(message, data)
    },
    // RoleManager

    // case 'warn': return adapter.punishments.warn.set(message, (data.mentions.members.first() !== null) ? data.mentions.members.first().id : data.arguments[0], data);
    // case 'warnings': return adapter.punishments.warn.printAll(message, data.mentions.members.first().id);
    // case 'kick': return adapter.punishments.kick.set(message, (data.mentions.members.first() !== null) ? data.mentions.members.first().id : data.arguments[0], data.arguments.slice(1).join(' '));
    // case 'kicks': return adapter.punishments.kick.printAll(message, data.mentions.members.first().id);
    // case 'ban': return adapter.punishments.ban.set(message, (data.mentions.members.first() !== null) ? data.mentions.members.first().id : data.arguments[0], data.arguments.slice(1).join(' '));
    // case 'bans': return adapter.punishments.ban.printAll(message, data.mentions.members.first().id);
    // case 'unban': return new Promise((resolve, reject) => {
    //         message.guild.members.unban(data.arguments[0])
    //             .then(user => {
    //                 user.send(`You have been unbanned from ${message.guild.name}.`);
    //                 resolve({
    //                     value: `Unbanned ${user.username}.`
    //                 });
    //             })
    //             .catch(e => reject(`Cannot unban user.\n${e.message}`));
    //     });
    "promote": {
        context: "server",
        description: "Promotes a user one level, or to the specified level. Min 0, max 4.",
        syntax: "{c} {0} {*1}",
        permissionLevel: 3,
        arguments: [
            {"@User(s)": "Pinged user(s)."},
            {"*Level": "Permission level. Max 0, min 4."}
        ],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.rolemanagement.setPermission.promote(message, data)
    },
    "demote": {
        context: "server",
        description: "Demotes a user one level, or to the specified level. Min 0, max 4.",
        syntax: "{c} {0} {*1}",
        permissionLevel: 3,
        arguments: [
            {"@User(s)": "Pinged user(s)."},
            {"*Level": "Permission level. Max 0, min 4."}
        ],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.rolemanagement.setPermission.demote(message, data)
    },
    "refreshrole": {
        context: "server",
        description: "Refreshes the user's roles.",
        syntax: "{c}",
        permissionLevel: 1,
        arguments: [],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {},
        enabled: false,
        run: (message, data) => adapter.rolemanagement.setRoles.refresh_user(message, data)
    },
    "refreshroles": {
        context: "server",
        description: "Refreshes the guild's users' roles.",
        syntax: "{c}",
        permissionLevel: 3,
        arguments: [],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.rolemanagement.setRoles.refresh_guild(message)
    },
    // case 'resetroles': return adapter.rolemanagement.setRoles.reset_guild(message);
    // case 'purgeroles': return adapter.rolemanagement.setRoles.purge(message);
    "setrole": {
        context: "server",
        description: "Defines a guild role to a bot permission role.",
        syntax: "{c} {0} {1}",
        permissionLevel: 4,
        arguments: [
            {"Role": "bot | vip | helper | mod | admin"},
            {"@Role": "Pinged role."}
        ],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.rolemanagement.setRoles.setRole(message, data)
    },
    // case 'timeout': {
    //     switch (data.arguments[0]) {
    //         case 'roles': {
    //             value = adapter.sql.server.timeouts.toMessage(message);
    //             break;
    //         }
    //     }
    //     break;
    // }

    // // Guilds

    // case 'guild_admin': {
    //     switch (data.arguments[0]) {
    //         case 'refresh': return adapter.rolemanagement.guilds.update(message, data);
    //         case 'other_join': return adapter.rolemanagement.guilds.admin_join(message, data);
    //         case 'other_leave': return adapter.rolemanagement.guilds.admin_leave(message, data);
    //         case 'disband': return adapter.rolemanagement.guilds.admin_disband(message, data);
    //     }
    //     break;
    // }
    // case 'guild': {
    //     switch (data.arguments[0]) {
    //         case 'create': return adapter.rolemanagement.guilds.newCandidate(message, data);
    //         case 'seticon': return adapter.rolemanagement.guilds.setIcon(message, data);
    //         case 'setcolor': return adapter.rolemanagement.guilds.setColor(message, data);
    //         case 'setlore': return adapter.rolemanagement.guilds.setLore(message, data);
    //         case 'setmotto': return adapter.rolemanagement.guilds.setMotto(message, data);
    //         case 'lore': return adapter.rolemanagement.guilds.getLore(message, data);
    //         case 'list': return adapter.rolemanagement.guilds.list(message, data);
    //         case 'join': return adapter.rolemanagement.guilds.join(message, data);
    //         case 'leave': return adapter.rolemanagement.guilds.leave(message, data);
    //         case 'invite': return adapter.rolemanagement.guilds.invite(message, data);  
    //         case 'toggle': return adapter.rolemanagement.guilds.toggleInvites(message, data);            
    //         case 'invites': return adapter.rolemanagement.guilds.getInvites(message, data);              
    //         case 'deny': return adapter.rolemanagement.guilds.deleteInvite(message, data);                
    //         case 'setofficer': return adapter.rolemanagement.guilds.promote(message, data, 'officer');        
    //         case 'setleader': return adapter.rolemanagement.guilds.promote(message, data, 'leader');            
    //         case 'setmember': return adapter.rolemanagement.guilds.promote(message, data, 'member');             
    //         case 'exhile': return adapter.rolemanagement.guilds.promote(message, data, 'exhiled');                
    //         case 'settitle': return adapter.rolemanagement.guilds.setTitle(message, data);               
    //         case 'help': return adapter.rolemanagement.guilds.listHelp(message, data);               
    //         default: return adapter.rolemanagement.guilds.view(message, data);                 
    //     }
    // }

    // // Minigames

    // case 'stats': {
    //     switch (data.arguments[0]) {
    //         case 'fishing': return adapter.minigames.stats.fishing(message);
    //         default: return adapter.minigames.stats.all(message);
    //     }
    // }
    // case 'cast': return adapter.minigames.fishing.cast(message);
    // case 'inventory': return adapter.minigames.inventory.find(message, data);

    // Music

    "play": {
        context: "music",
        description: "Plays a song in the voice channel.",
        syntax: "{c} {0}",
        permissionLevel: 0,
        arguments: [
            {"Song": "Video title | YouTube URL(s)"}
        ],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.music.queue.addSong(message, data)
    },
    "join": {
        context: "music",
        description: "Puts the bot into the requested voice channel.",
        syntax: "{c}",
        permissionLevel: 0,
        arguments: [],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.music.voiceChannel.join(message)
    },
    "leave": {
        context: "music",
        description: "Removes the bot from the voice channel.",
        syntax: "{c}",
        permissionLevel: 0,
        arguments: [],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.music.voiceChannel.leave(message)
    },
    "skip": {
        context: "music",
        description: "Skips the current song in the active queue.",
        syntax: "{c}",
        permissionLevel: 0,
        arguments: [],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.music.queue.skip(message)
    },
    "stop": {
        context: "music",
        description: "Stops the active queue.",
        syntax: "{c}",
        permissionLevel: 0,
        arguments: [],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.music.queue.stop(message)
    },
    "queue": {
        context: "music",
        description: "Lists the songs in the active queue.",
        syntax: "{c}",
        permissionLevel: 0,
        arguments: [],
        properties: [],
        alternatives: ['q'],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.music.queue.list(message, data)
    },
    "pause": {
        context: "music",
        description: "Pauses the active queue.",
        syntax: "{c}",
        permissionLevel: 0,
        arguments: [],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.music.queue.pause(message)
    },
    "resume": {
        context: "music",
        description: "Resumes a paused active queue.",
        syntax: "{c}",
        permissionLevel: 0,
        arguments: [],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.music.queue.resume(message)
    },
    "songinfo": {
        context: "music",
        description: "Gathers information about a song.",
        syntax: "{c} {0}",
        permissionLevel: 0,
        arguments: [
            {"Song": "Video title | YouTube URL"}
        ],
        properties: [],
        alternatives: ['song?'],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.music.song.info(message, data)
    },
    "ytdl": {
        context: "music",
        description: "Downloads an MP4 audio file.",
        syntax: "{c} {0}",
        permissionLevel: 1,
        arguments: [
            {"Song": "Video title | YouTube URL"}
        ],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.music.song.download(data)
    },
    "playlist": {
        context: "music",
        description: "Playlist root command for user-defined playlists.",
        syntax: "{c} {0} {1}",
        permissionLevel: 1,
        arguments: [
            {"Subcommand": "play | list | create | add | delete | remove | access"},
            {"Arguments": "Subcommand arguments."}
        ],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.music.playlist(message, data)
    },

    // // Memes

    "f": {
        context: "",
        description: "",
        syntax: "",
        permissionLevel: 0,
        arguments: [],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.memes.memeDispatch('f')
    },
    // case 'fuck': return adapter.memes.memeDispatch('fuuu');
    // case 'yey': return adapter.memes.memeDispatch('yey');
    "thowonk": {
        context: "",
        description: "",
        syntax: "",
        permissionLevel: 0,
        arguments: [],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.memes.memeDispatch('thowonk')
    },
    "penguin": {
        context: "",
        description: "",
        syntax: "",
        permissionLevel: 0,
        arguments: [],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.memes.memeDispatch('penguin')
    },
    "bird": {
        context: "",
        description: "",
        syntax: "",
        permissionLevel: 0,
        arguments: [],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.memes.memeDispatch('bird')
    },
    "clayhead": {
        context: "",
        description: "",
        syntax: "",
        permissionLevel: 0,
        arguments: [],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.memes.memeDispatch('clayhead')
    },
    "extrathicc": {
        context: "",
        description: "",
        syntax: "",
        permissionLevel: 0,
        arguments: [],
        properties: [],
        alternatives: [],
        flags: [],
        settings: {},
        enabled: true,
        run: (message, data) => adapter.memes.memeDispatch('extra_thicc')
    }
    // case 'crabrave': return adapter.music.append.byURL(message, 'https://www.youtube.com/watch?v=LDU_Txk06tM');
    // case 'theriddle': return adapter.music.append.byURL(message, 'https://www.youtube.com/watch?v=9DXMDzqA-UI');
}