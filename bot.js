const Discord = require('discord.js');

const fs = require('fs');

const config = require('./src/main/bot/config');
const settings = config.settings;
const auth = config.auth;

const music = require('./src/music/music');
const gaming = require('./src/minigames/gaming');
const fishing = require('./src/minigames/fishing/core');
const mining = require('./src/minigames/mining/core');
const gathering = require('./src/minigames/gathering/core');
const global = require('./src/main/global');

// Helpers
const sell = require('./src/main/bot/helpers/sell');
const teststats = require('./src/main/bot/helpers/teststats');
const cleanChat = require('./src/main/bot/helpers/cleanChat');
const startup = require('./src/minigames/helpers/startupRoutine');
const saveStats = require('./src/minigames/helpers/saveStats');

const client = new Discord.Client();
client.token = auth.token;

client.on('ready', () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);

    startup()
    .then(stats => {
        if (stats) {
            console.log('After startup:');
            console.log(stats);
            gaming.stats = stats;

            client.user.setActivity((gaming.stats) ? `with Chris' nuts | .?` : `with faulty code...`);
        }
        else {
            client.user.setActivity("Failed startup.");
        }

        saveStats()
        .then(r => {
            if (r) global.log('Successfully saved stats.');
            else global.log('Failed to save stats.', 'warn')
        })
        .catch(e => {
            global.log('Exception: Error thrown from bot gaming.startup -> gaming.save promise - caught.', 'error');
            global.log(e, 'warn');
            if (e == null) global.log('This is null because the await for loading stats from file has not resolved.', 'info');
        });

        gaming.client = client;
        global.client = client;
        fishing.setLootpool();

        global.log('Started', 'info')
        .then(s => {
            //
        })
        .catch(e => {
            console.log(e);
            client.users.get("188020615989428224").send('Failed to log out startup.');
        });
    })
    .catch(e => {
        console.log(e);
        client.user.setActivity("Caught on startup.");
    });
});

client.on('message', async message => {
    if (message.author.id == '159985870458322944') {
        message.channel.send('FUCK OFF MEE6, YOU STUPID BITCH :dagger: :knife: :fire:');
        return;
    }
    if (message.author.bot) return;
    if (!settings.prefix.includes(message.content.charAt(0))) return;

    const msgArray = message.content.split(' ');
    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    switch (command) {
        // Regular Commands
        case 'toggleremote': {
            global.toggleRemote();
            break;
        }
        case 'clean': {
            cleanChat(message);
            break;
        }
        case 'ping': {
            message.channel.send('You rang?')
            .then(msg => {
                msg.edit(`Some stats: Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API latency is ${Math.round(client.ping)}ms.`);
            })
            .catch(e => {
                console.log(e);
            });
            break;
        }
        case 'crabravelink': {
            message.channel.send('> https://www.youtube.com/watch?v=LDU_Txk06tM');
            break;
        }
        case '?': {}
        case 'help': {
            global.listHelp(message);
            break;
        }
        case 'whoami': {
            message.channel.send(`Name: ${message.author.username}#${message.author.discriminator} | Nickname: ${message.member.nickname}\nID: ${message.author.id}`);
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
            message.channel.send((msgArray[1])
                ? fishing.getRequiredCatch(msgArray[1])
                : 'Syntax: tolevel {number}\nExample: tolevel 3'
            );
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
            sell(message);
            break;
        }
        case 'teststats': {
            message.channel.send(teststats(music, gaming, global, fishing, mining, gathering));
            break;
        }
        case 'inv': {}
        case 'inventory': {
            gaming.listInventory(message, msgArray[1]);
            break;
        }
        case 'rs': {}
        case 'restart': {
            message.channel.send('Restarting, one moment please...')
            .then(msg => client.destroy())
            .then(() => client.login(config.token));
            break;
        }
        case 'resetuser': {
            try {
                let user = await gaming.newUser(message);
                gaming.stats[message.author.id] = user;
                saveStats()
                .then(r => {
                    if (r) message.channel.send(`Reset user <@${message.author.id}>.`);
                    else message.channel.send(`Failed to reset user <@${message.author.id}>.`);
                })
                .catch(e => {
                    console.log(e);
                    global.log('Exception: Error thrown from bot -> resetuser -> saveStats promise - caught.', 'error');
                    global.log(`User ID: ${message.author.id}`, 'error');
                })
            }
            catch (e) {
                console.log(e);
                global.log('Exception: Error resetting user stat data.', 'error');
                global.log(`User ID: ${message.author.id}`, 'error');
            }
            break;
        }

        // Music Commands
        case 'join': {
            music.join(message);
            break;
        }
        case 'play': {
            music.playSong(message);
            return;
        }
        case 'skip': {
            message.channel.send("Skipping...");
            music.skip(message);
            break;
        }
        case 'stop': {
            music.stop(message);
            break;
        }
        case 'q': {}
        case 'queue': {
            music.getMusicQueue(message);
            break;
        }
        case 'p': {}
        case 'playlist': {
            switch (msgArray[1]) {
                case 'create': {
                    music.createPlaylist(message);
                    break;
                }
                case 'add': {
                    music.addToPlaylist(message);
                    break;
                }
                case 'play': {
                    music.playPlaylist(message);
                    break;
                }
                case 'list': {
                    if (msgArray.length > 2) {
                        fs.readFile(`${global.playlistPath}${msgArray[2]}.json`, function (err, data) {
                            if (err) {
                                console.log(err);
                                return;
                            }
                        
                            music.listPlaylist(JSON.parse(data), message, msgArray[3] === '-l');                          
                        });
                    }
                    else {
                        fs.readdir(global.playlistPath, function(err, items) {
                            if (err) {
                                console.log(err);
                                return;
                            }

                            let msg = '';                            
                            for (let i = 0; i < items.length; i++) {
                                msg += `${i + 1}. ${items[i].split('.')[0]}\n`;
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
                    
                            let obj = JSON.parse(data);
                            obj.playlist.splice(index, 1);

                            fs.writeFile(`${global.playlistPath}${msgArray[2]}.json`, JSON.stringify(obj), (err, data) => {
                                if (err) {
                                    console.log('Error writing to file' + err);
                                    return;
                                }
                            });

                            message.channel.send(`Removed item ${index + 1} from the playlist.`);

                            let msg = '';
                            for (let i = 0; i < obj.playlist.length; i++) {
                                try {
                                    msg += `${i + 1}. ${obj.playlist[i].title}\n`;
                                }
                                catch { return; }
                            }

                            message.channel.send(msg);
                        });
                    }
                    catch (e) {
                        console.log(e);
                    }
                    break;
                }
            } // End switch
            break;
        }
    }
});

client.login(client.token);