const Discord = require('discord.js');

const fs = require('fs');

const auth = require('./auth.json');
const config = require('./config.json');

const music = require('./scripts/music');
const gaming = require('./scripts/gaming');
const fishing = require('./main/gaming/fishing/fishing');
const mining = require('./main/gaming/mining/mining');
const gathering = require('./main/gaming/gathering/gathering');
const global = require('./main/global');
const help = require('./help');

const client = new Discord.Client();
client.token = auth.token;

client.on('ready', () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);

    gaming.startup()
    .then(s => {
        if (s) {
            console.log('After startup:');
            console.log(s);
            gaming.stats = s;
            if (gaming.stats) client.user.setActivity("with Chris' nuts | .?");
            else client.user.setActivity("Technical difficulties...");
        }
        else {
            client.user.setActivity("Failed startup.");
        }
    })
    .catch(e => {
        console.log(e);
        client.user.setActivity("Caught on startup.");
    });

    gaming.client = client;
    global.client = client;

    fishing.updateAvailableFish();

    global.log('Started', 'info')
    .then(s => {
        //
    })
    .catch(e => {
        console.log(e);
        client.users.get("188020615989428224").send('Failed to log out startup.');
    });

    gaming.save()
    .then(r => {
        if (r) global.log('Successfully saved stats.');
        else global.log('Failed to save stats.', 'warn')
    })
    .catch(e => {
        global.log('Exception: Error thrown from bot gaming.startup -> gaming.save promise - caught.', 'error');
        global.log(e, 'warn');
        if (e == null) global.log('This is null because the await for loading stats from file has not resolved.', 'info');
    });
});

client.on('message', async message => {
    if (message.author.id == '159985870458322944') {
        message.channel.send('FUCK OFF MEE6, YOU STUPID BITCH :dagger: :knife: :fire:');
        return;
    }
    if (message.author.bot) return;
    if (!config.prefix.includes(message.content.charAt(0))) return;

    const msgArray = message.content.split(' ');
    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const serverQueue = music.queue.get(message.guild.id);

    switch (command) {
        // Regular Commands
        case 'setmainchannel': {
            global.botChannel = message.channel;
            fs.writeFile('./standard.json', JSON.stringify(global), function (err, data) {
                if (err) {
                    console.log(err);
                    return;
                }
            });
            global.botChannel.send('Success!');
            break;
        }
        case 'ping': {
            const m = await message.channel.send('You rang?');
            m.edit(`Some stats: Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API latency is ${Math.round(client.ping)}ms.`);
            break;
        }
        case 'crabravelink': {
            const m = await message.channel.send('> https://www.youtube.com/watch?v=LDU_Txk06tM');
            break;
        }
        case '?': {}
        case 'help': {
            let msg = '';
            global.listHelp(message);
            break;
        }
        case 'whoami': {
            let str = `Name: ${message.author.username}#${message.author.discriminator} | Nickname: ${message.member.nickname}\nID: ${message.author.id}`;
            console.log(str);
            //console.log(message.author);
            message.channel.send(str);
            break;
        }
        case 'fuck': {
            message.channel.send('FUCK!',{files:['https://i0.kym-cdn.com/entries/icons/original/000/000/063/Rage.jpg']});
            break;
        }
        case 'f': {
            message.channel.send('F',{files:['https://i1.sndcdn.com/avatars-000171827536-fu8j6k-t500x500.jpg']});
            break;
        }

        // Gaming

        // Fishing
        case 'cast': {
            fishing.cast(message);
            break;
        }
        case 'breakmyrod': {
            fishing.breakRod(message);
            break;
        }
        case 'fishlist': {
            fishing.listFish(message);
            break;
        }
        case 'fishfact': {
            fishing.fishInfo(message, msgArray[1]);
            break;
        }
        case 'tolevel': {
            if (msgArray[1]) {
                try {
                    message.channel.send(fishing.getRequiredCatch(msgArray[1]));
                }
                catch {
                    message.channel.send('Invalid level, try providing a whole number...');
                }
            }
            else message.channel.send('Syntax: tolevel {number}\nExample: tolevel 3');
            break;
        }

        // Mining
        case 'mine': {
            mining.mine(message);
            break;
        }
        case 'abortmine': {
            gaming.stats[message.author.id].mining.pick.inUse = false;
            break;
        }

        // Gathering
        case 'itemlist': {
            gathering.listItems(message);
            break;
        }

        // Everything else
        case 'stats': {
            gaming.listStats(message);
            break;
        }
        case 'sell': {
            if (msgArray[1]) {
                switch (msgArray[1]) {
                    case 'fish': {
                        fishing.sellInv(message);
                        break;
                    }
                    case 'ores': {
                        message.channel.send('Not implemented.');
                        break;
                    }
                    case 'items': {
                        gathering.sellInv(message);
                        break;
                    }
                }
            }
            else {
                message.channel.send('_Info will go here on inventory total worths._');
            }
            break;
        }
        case 'teststats': {
            let results = {};
            if (music) results.music = true;
            else results.music = false;
            if (gaming) {
                results.gaming = true;
                if (gaming.stats) {
                    results.stats = true;
                    console.log(gaming.stats);
                }
                else results.stats = false;
            }
            else results.music = false;
            if (global) results.global = true;
            else results.global = false;
            if (fishing) results.fishing = true;
            else results.fishing = false;
            if (mining) results.mining = true;
            else results.mining = false;

            console.log(results);
            let msg = '';
            let bool = true;
            for (i in results) {
                if (results[i]) msg += `${i} - Loaded\n`
                else {
                    msg += `${i} - Unloaded\n`
                    if (bool) bool = false;
                }
            }
            message.channel.send(msg);
            if (bool) client.user.setActivity('Technical difficulties...');
            else client.user.setActivity('TILDA {CMD} | ~?');
            break;
        }
        case 'inv': {}
        case 'inventory': {
            gaming.listInventory(message, msgArray[1]);
            break;
        }
        case 'rs': {}
        case 'restart': {
            const m = await message.channel.send('Restarting, one moment please...')
            .then(msg => client.destroy())
            .then(() => client.login(auth.token));
            break;
        }
        case 'pushupdate': {
            let obj = {
                level: 0,
                rod: {
                    durability: 20,
                    catches: 0,
                    inUse: false
                }
            }
            gaming.updateAllUsers('fishing', obj);
            message.channel.send('Updated all users');
            break;
        }
        case 'resetuser': {
            try {
                let user = await gaming.newUser(message);
                gaming.stats[message.author.id] = user;
                gaming.pushStats();
                message.channel.send(`Reset user <@${message.author.id}>.`);
                console.log(gaming.stats[message.author.id]);
            }
            catch (e) {
                console.log(e);
            }
            break;
        }

        // Music Commands
        case 'join': {
            const vc = music.getVC(message);
            if (!vc) {
                message.channel.send("You're not in a voice channel, dummy...");
                return;
            }
            else {
                vc.join()
                .then(connection => {
                    console.log('Success!');
                })
                .catch(e => {
                    console.log(e);
                })
            }
            
            break;
        }
        case 'play': {
            music.playSong(message, serverQueue);
            return;
        }
        case 'skip': {
            const m = await message.channel.send("Skipping...");
            music.skip(message, serverQueue);
            break;
        }
        case 'stop': {
            const m = await message.channel.send("Stopping all music.");
            music.stop(message, serverQueue);
            break;
        }
        case 'q': {}
        case 'queue': {
            if (!serverQueue) {
                message.channel.send(`The queue contains... _n o t h i n g . . ._`);
                return;
            }
            let msg = '';
            if (music.previousSong != null) msg += `**Previous** - ${music.previousSong.title}.\n${global.chatBreak}\n`;
            let upTo = serverQueue.songs.length <= 10 ? serverQueue.songs.length : 10;
            msg += `**Now Playing...** ${serverQueue.songs[0].title}\n${global.chatBreak}\n**Up next**:\n`;

            if (serverQueue.songs.length > 1) {
                for (let i = 1; i <= upTo; i++) {
                    msg += `${i}. ${serverQueue.songs[i].title}\n`;
                }
                if (serverQueue.songs.length > 10) {
                    msg += `... and ${serverQueue.songs.length - 10} more!`;
                }
                message.channel.send(msg);
            }
            else if (serverQueue.songs.length == 1) {
                message.channel.send(`**Now Playing...** ${serverQueue.songs[0].title}`);
            }
            else {
                message.channel.send(`The queue contains... _n o t h i n g . . ._`);
            }
            break;
        }
        case 'p': {}
        case 'playlist': {
            const subCommand = message.content.split(' ')[1];
            switch (subCommand) {
                case 'create': {
                    music.createPlaylist(message);
                    break;
                }
                case 'add': {
                    music.addToPlaylist(message);
                    break;
                }
                case 'play': {
                    try {
                        const m = await message.channel.send(`Starting playlist ${msgArray[2]}.`)
                        fs.readFile(`${global.playlistPath}${msgArray[2]}.json`, function (err, data) {
                            if (err) {
                                console.log(err);
                                return;
                            }
                    
                            if (data == '') {
                                message.channel.send('Playlist contains 0 items.');
                                return;
                            }
                        
                            let obj = JSON.parse(data);
                            m.edit(`Starting playlist ${msgArray[2]}.\nSong count - ${obj.playlist.length}`);
                            let shuffle;
                            if (msgArray[3] === '-s') shuffle = true;
                            else shuffle = false;
                            music.addToQueue(obj, message, serverQueue, shuffle);
                        });
                    }
                    catch (e) {
                        console.log(e);
                    }
                    break;
                }
                case 'list': {
                    if (msgArray.length > 2) {
                        fs.readFile(`${global.playlistPath}${msgArray[2]}.json`, function (err, data) {
                            if (err) {
                                console.log(err);
                                return;
                            }
                    
                            if (data == '') {
                                message.channel.send('Playlist contains 0 items.');
                                return;
                            }
                        
                            let obj = JSON.parse(data);

                            music.listPlaylist(obj, message, msgArray[3] === '-l')
                            .then(s => {
                                console.log('Listed.');
                            })
                            .catch(e => {
                                console.log(e);
                            })                            
                        });
                    }
                    else {
                        fs.readdir(global.playlistPath, function(err, items) {

                            let msg = '';
                            let m;
                            
                            for (var i=0; i<items.length; i++) {
                                m = items[i].split('.')[0];
                                msg += (i + 1) + '. ' + m + '\n';
                            }
                            message.channel.send(msg);
                        });
                    }
                    break;
                }
                case 'remove': {
                    if (msgArray.length < 4) return;
                    if (msgArray[3] < 1) return;

                    let index = msgArray[3] - 1;

                    try {
                        fs.readFile(`${global.playlistPath}${msgArray[2]}.json`, function (err, data) {
                            if (err) {
                                console.log(err);
                                return;
                            }
                    
                            if (data == '') {
                                message.channel.send('Playlist contains 0 items.');
                                return;
                            }
                        
                            let obj = JSON.parse(data);
                            obj.playlist.splice(index, 1);

                            fs.writeFile(`${global.playlistPath}${msgArray[2]}.json`, JSON.stringify(obj), (err, data) => {
                                if (err) {
                                    console.log('Error writing to file' + err);
                                }
                            });

                            message.channel.send(`Removed item ${index + 1} from the playlist.`);

                            let msg = '';
                            for (let i = 0; i < obj.playlist.length; i++) {
                                try {
                                    msg += `${i + 1}. ${obj.playlist[i].title}\n`;
                                }
                                catch {}
                            }

                            message.channel.send(msg);
                        });
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            }
            break;
        }
    }
});

client.login(config.token);