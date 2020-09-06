const adapter = require('./app/adapter');

module.exports = {
    // Common
    "help": {
        run: (message, data) => adapter.common.bot.features.listHelp(message, data.arguments)
    },
    "clean": {
        run: (message, data) => adapter.common.bot.features.cleanChat(message)
    },
    "ping": {
        run: (message, data) => adapter.common.bot.features.ping(message)
    },
    "roll": {
        run: (message, data) => adapter.common.bot.features.roll(data.arguments)
    },
    "shuffle": {
        run: (message, data) => {
            return new Promise((resolve, reject) => {
                adapter.common.bot.global.shuffle(data.arguments[0].split(','))
                    .then(arr => resolve({values: arr, content: [arr.join(', ')]}))
                    .catch(e => reject({rejections: [e], content: []}));
            });
        }
    },
    "whoami": {
        run: (message, data) => adapter.common.bot.features.whoAre.self(message)
    },
    "whoareyou": {
        run: (message, data) => adapter.common.bot.features.whoAre.member(message)
    },
    "setmotd": {
        run: (message, data) => {
            return (data.flags['r'])
                ? adapter.common.bot.features.motd.set(message, "First Title&tSome message.\\nA new line|Second Title&tSome message.<l>http://google.com/")
                : adapter.common.bot.features.motd.set(message, data.arguments.join(' '));
        }
    },
    "motd": {
        run: (message, data) => adapter.common.bot.features.motd.get(message, data.parameters)
    },
    "setprefix": {
        run: (message, data) => adapter.common.bot.features.prefix.set(message, data.arguments[0])
    },
    "prefix": {
        run: (message, data) => adapter.common.bot.features.prefix.get(message)
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
        run: (message, data) => adapter.rolemanagement.setPermission.promote(message, data)
    },
    "demote": {
        run: (message, data) => adapter.rolemanagement.setPermission.demote(message, data)
    },
    // case 'refreshrole': return adapter.rolemanagement.setRoles.refresh_user(message, message.mentions.members.first() || message.member);
    // case 'refreshroles': return adapter.rolemanagement.setRoles.refresh_guild(message);
    // case 'resetroles': return adapter.rolemanagement.setRoles.reset_guild(message);
    // case 'purgeroles': return adapter.rolemanagement.setRoles.purge(message);
    "setrole": {
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
        run: (message, data) => adapter.music.append.fetch(message, data)
    },
    "join": {
        run: (message, data) => adapter.music.join(message)
    },
    "leave": {
        run: (message, data) => adapter.music.leave(message)
    },
    "skip": {
        run: (message, data) => adapter.music.skip(message)
    },
    "stop": {
        run: (message, data) => adapter.music.stop(message)
    },
    "queue": {
        run: (message, data) => adapter.music.list(message, data)
    },
    "pause": {
        run: (message, data) => adapter.music.pause(message)
    },
    "resume": {
        run: (message, data) => adapter.music.resume(message)
    },
    "songinfo": {
        run: (message, data) => adapter.music.info(message, data)
    },
    "playlist": {
        run: (message, data) => adapter.music.playlistCommand(message, data)
    },

    // // Memes

    "f": {
        run: (message, data) => adapter.memes.memeDispatch('f')
    },
    // case 'fuck': return adapter.memes.memeDispatch('fuuu');
    // case 'yey': return adapter.memes.memeDispatch('yey');
    "thowonk": {
        run: (message, data) => adapter.memes.memeDispatch('thowonk')
    },
    "penguin": {
        run: (message, data) => adapter.memes.memeDispatch('penguin')
    },
    "bird": {
        run: (message, data) => adapter.memes.memeDispatch('bird')
    },
    "clayhead": {
        run: (message, data) => adapter.memes.memeDispatch('clayhead')
    },
    "extrathicc": {
        run: (message, data) => adapter.memes.memeDispatch('extra_thicc')
    }
    // case 'crabrave': return adapter.music.append.byURL(message, 'https://www.youtube.com/watch?v=LDU_Txk06tM');
    // case 'theriddle': return adapter.music.append.byURL(message, 'https://www.youtube.com/watch?v=9DXMDzqA-UI');
}