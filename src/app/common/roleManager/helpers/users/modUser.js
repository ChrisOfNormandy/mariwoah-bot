const createUser = require('./createUser');
const getUser = require('./getUser');

function generateData(message, args) {
    let date = new Date();
    return {
        latest: {
            "time": `${date.toLocaleDateString()} at ${date.toTimeString()}`,
            "reason": args.reason || ""
        },
        data: {
            "date": {
                "day": date.toLocaleDateString(),
                "time": date.toTimeString()
            },
            "reason": args.reason || "",
            "staffID": message.author.id,
            "pardoned": {
                "value": false,
                "staffID": null,
                "date": {
                    "day": null,
                    "time": null
                },
                "reason": null
            }
        }
    }
}

function dmMessage(message, user, userID, args, operation) {
    return new Promise(function (resolve, reject) {
        let op = {
            ed: '',
            data: '',
            ing: ''
        }
        switch (operation) {
            case 'warn': {
                op = { ed: 'warned', data: 'warnings', ing: 'warning' };
                break;
            }
            case 'kick': {
                op = { ed: 'kicked', data: 'kicks', ing: 'kick' };
                break;
            }
            case 'ban': {
                op = { ed: 'banned', data: 'bans', ing: 'ban' };
                break;
            }
            case 'banRevert': {
                op = { ed: 'unbanned', data: 'banReverts', ing: 'pardon' };
                break;
            }
        }

        if (operation != 'banRevert')
            resolve(message.channel.guild.members.get(userID).send(
                `You have been ${op.ed} by ${message.author.username} in ${message.channel.guild.name}.\n` +
                `You currently have ${user.data[op.data].length} ${op.ing}${(user.data[op.data].length > 1) ? 's' : ''} on record.\n` +
                `\n` +
                `Reason given: ${args.reason || 'No reason was given'}.` +
                `\n` +
                `**__This is an automated message. Responding to this does nothing.__**`
            ));
        else
            resolve();
    })

}

module.exports = {
    byString: function (message, userID, operation, args = null) {
        return new Promise(function (resolve, reject) {
            getUser(message, userID)
                .then(user => {
                    if (operation == 'warn' || operation == 'kick' || operation == 'ban' || operation == 'banRevert') {
                        let val = { latest: '', data: '' };
                        let data = generateData(message, args);

                        switch (operation) {
                            case 'warn': {
                                val.latest = "latestWarnings";
                                val.data = "warnings"
                                break;
                            }
                            case 'kick': {
                                val.latest = "latestKicks";
                                val.data = "kicks"
                                break;
                            }
                            case 'ban': {
                                val.latest = "latestBans";
                                val.data = "bans"
                                break;
                            }
                            case 'banRevert': {
                                val.latest = "latestBanReverts";
                                val.data = "banReverts"
                                break;
                            }
                        }

                        user.data[val.latest] = data.latest
                        user.data[val.data].push(data.data);

                        dmMessage(message, user, userID, args, operation)
                            .then(() => {
                                resolve({ status: true, args: { operation: operation, result: user.data[val.data] }, user: user });
                            });
                    }
                    else {
                        switch (operation) {
                            case 'reset': {
                                createUser(message, message.mentions.members.first().id)
                                    .then(newUser => {
                                        resolve({ status: true, args: { operation: 'reset', result: newUser }, user: newUser });
                                    })
                                    .catch(e => reject(e));
                                break;
                            }
                            case 'pardon': {
                                let date = new Date();
                                console.log(args);
                                if (args.index - 1 < 0 || !user.data[args.punishment] || !user.data[args.punishment][args.index - 1])
                                    resolve({ status: false, args: { operation: 'pardon', result: null }, user: user });
                                else {
                                    if (user.data[args.punishment][args.index - 1].pardoned.value)
                                        user.data[args.punishment][args.index - 1].pardoned = {
                                            "value": false,
                                            "staffID": null,
                                            "date": {
                                                "day": null,
                                                "time": null
                                            },
                                            "reason": null
                                        }
                                    else
                                        user.data[args.punishment][args.index - 1].pardoned = {
                                            "value": true,
                                            "staffID": message.author.id,
                                            "date": {
                                                "day": date.toLocaleDateString(),
                                                "time": date.toTimeString()
                                            },
                                            "reason": args.reason || ""
                                        }
                                    resolve({ status: true, args: { operation: 'pardon', result: user }, user: user });
                                }
                                break;
                            }
                            case 'promote': {
                                if (user.data.permissions.level < 4) {
                                    user.data.permissions.level++;
                                    switch (user.data.permissions.level) {
                                        case 1: { message.channel.send('Promoted user to VIP.'); break; }
                                        case 2: { message.channel.send('Promoted user to Helper.'); break; }
                                        case 3: { message.channel.send('Promoted user to Moderator.'); break; }
                                        case 4: { message.channel.send('Promoted user to Administrator.'); break; }
                                    }
                                }
                                else message.channel.send('You cannot promote a user higher than admin!');
                                resolve({ status: true, args: { operation: 'promote', result: user }, user: user });
                                break;
                            }
                            case 'demote': {
                                if (user.data.permissions.level > 0) {
                                    user.data.permissions.level--;
                                    switch (user.data.permissions.level) {
                                        case 0: { message.channel.send('Demoted user to default.'); break; }
                                        case 1: { message.channel.send('Promoted user to VIP.'); break; }
                                        case 2: { message.channel.send('Promoted user to Helper.'); break; }
                                        case 3: { message.channel.send('Promoted user to Moderator.'); break; }
                                    }
                                }
                                else message.channel.send('You cannot demote a user lower than default!');
                                resolve({ status: true, args: { operation: 'demote', result: user }, user: user });
                                break;
                            }
                            case 'setBotAdmin': {
                                if (user.data.permissions.botAdmin)
                                    resolve({ status: false, args: { operation: 'setBotAdmin', result: user }, user: user });

                                user.data.permissions.botAdmin = true;
                                resolve({ status: true, args: { operation: 'setBotAdmin', result: user }, user: user });
                                break;
                            }
                            case 'setBotMod': {
                                if (user.data.permissions.botMod)
                                    resolve({ status: false, args: { operation: 'setBotMod', result: user }, user: user });

                                user.data.permissions.botMod = true;
                                resolve({ status: true, args: { operation: 'setBotMod', result: user }, user: user });
                                break;
                            }
                            case 'setBotHelper': {
                                if (user.data.permissions.botHelper)
                                    resolve({ status: false, args: { operation: 'setBotHelper', result: user }, user: user });

                                user.data.permissions.botHelper = true;
                                resolve({ status: true, args: { operation: 'setBotHelper', result: user }, user: user });
                                break;
                            }
                        }
                    }
                })
                .catch(e => console.log(e));
        });
    }
}