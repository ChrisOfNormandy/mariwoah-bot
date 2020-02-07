module.exports = {
    main: {
        header: '### Help Commands ###\nUsage: ~help {subcommand} OR ~? {subcommand}\n_Allowed prefixes:_ . - ~',
        commands: {
            'common': {
                description: 'General use commands.',
            },
            'roleManager': {
                description: 'Role management commands.'
            },
            'music': {
                description: 'Music related commands.',
            },
            'playlist': {
                description: 'Playlist related commands.',
            },
            'minigames': {
                description: 'Minigames related commands. Try ~help minigames {game} for a specific minigame.'
            },
            'memes': {
                description: 'Meme commands. Just for fun.'
            }
        }
    },
    common: {
        header: '### Common Commands ###',
        commands: {
            'ping': {
                description: 'Gets the Discord latency (delay between send and edit) and bot-to-server latency.',
                permissionLevel: 0,
            },
            'clean': {
                description: 'Cleans the chat of bot messages and commands.',
                permissionLevel: 3,
                arguments: [
                    ['@Username'],
                    ['The user you want to remove messages for.']
                ],
            },
            'help': {
                description: 'Lists help, duh.',
                permissionLevel: 0,
                alternatives: ['?'],
            },
            'whoami': {
                description: 'Lists your Discord name and discriminator (#numb), server join date and roles.',
                permissionLevel: 0,
            },
            'whoareyou': {
                description: 'Lists a user Discord name and discriminator (#numb), server join date and roles.',
                permissionLevel: 0,
                arguments: [
                    ['@Username'],
                    ['The user you want information about.']
                ]
            },
            'roll': {
                description: 'Rolls a number between 1 and a provided value (default 6).',
                permissionLevel: 0,
                arguments: [
                    ['sides', 'count'],
                    ['Maximum value / sides of dice. 2 = coin flip.', 'How many times the action should be repeated. Default 1; max 50.']
                ]
            }
        }
    },
    roleManager: {
        header: '### Role Manager Commands ###',
        commands: {
            'setmotd': {
                description: 'Sets the server Message of the Day. Remains until executed again.',
                permissionLevel: 4,
                arguments: [
                    ['message'],
                    ['MOTD formatted as: ...']
                ],
            },
            'motd': {
                description: 'Gets the server Message of the Day.',
                permissionLevel: 0,
            },
            'warn': {
                description: 'Warns the user with or without a specified reason.',
                permissionLevel: 2,
                arguments: [
                    ['@user | userID', 'reason'],
                    ['Ping of the target user | ID of the target user', 'Optional; if supplied, will list reason for warning when checking user history.']
                ],
            },
            'kick': {
                description: 'Kicks the user with or without a specified reason.',
                permissionLevel: 3,
                arguments: [
                    ['@user | userID', 'reason'],
                    ['Ping of the target user | ID of the target user', 'Optional; if supplied, will list reason for kick when checking user history.']
                ],
            },
            'ban': {
                description: 'Bans the user with or without a specified reason.',
                permissionLevel: 4,
                arguments: [
                    ['@user | userID', 'reason'],
                    ['Ping of the target user | ID of the target user', 'Optional; if supplied, will list reason for ban when checking user history.']
                ],
            },
            'unban': {
                description: 'Pardons the user with or without a specified reason.',
                permissionLevel: 4,
                arguments: [
                    ['userID', 'reason'],
                    ['ID of the target user', 'Optional; if supplied, will list reason for pardon when checking user history.']
                ],
            },
            'rm_reset': {

            },
            'rm_info': {
                description: 'Provides user history of warnings, kicks, bans and ban reverts.',
                permissionLevel: 2,
                arguments: [
                    ['@user'],
                    ['Ping of the target user']
                ],
            }
        }
    },
    music: {
        header: '### Music Commands ###',
        commands: {
            'join': {
                description: 'Puts the bot into your active voice chat. You must be connected to a voice chat to work.',
                permissionLevel: 1,
            },
            'play': {
                description: 'Plays the YouTube URL audio in the active voice chat.',
                permissionLevel: 1,
                arguments: [
                    ['url'],
                    ['YouTube URL for a given video/song.']
                ]
            },
            'leave': {
                description: 'Kicks the bot out of its active voice chat.',
                permissionLevel: 2,
            },
            'skip': {
                description: 'Skips the current song, plays next if another available in queue.',
                permissionLevel: 1,
            },
            'stop': {
                description: 'Clears the music queue and disconnects the bot from the voice channel.',
                permissionLevel: 1,
            },
            'queue': {
                description: 'Lists the current music queue.',
                permissionLevel: 1,
                alternatives: ['q'],
            }
        }
    },
    playlist: {
        header: '### Playlist Commands ###\nUsage: playlist {subcommand} OR pl {subcommand}',
        commands: {
            'create': {
                description: 'Creates a playlist of the given name.',
                permissionLevel: 2,
                arguments: [
                    ['name'],
                    ['Playlist name (will become JSON file name).']
                ],
            },
            'add {name} {url}': {
                description: 'Adds URL to the playlist of the given name.',
                permissionLevel: 2,
                arguments: [
                    ['name url'],
                    ['Playlist name; YouTube URL for a given video/song.']
                ]
            },
            'list': {
                description: '...',
                permissionLevel: 1,
                arguments: [
                    ['', 'name'],
                    [
                        'Lists all available playlists.',
                        'Lists all songs in the named playlist.'
                    ]
                ],
                flags: [
                    ['l'],
                    ['Includes video URL.']
                ]
            },
            'remove': {
                description: 'Removes the song at given index from the named playlist.',
                permissionLevel: 2,
                arguments: [
                    ['name index'],
                    ['Playlist name; Song index (found using list command)']
                ]
            },
            'play': {
                description: 'Adds all songs in the named playlist to the music queue.',
                permissionLevel: 1,
                arguments: [
                    ['name'],
                    ['Playlist name.']
                ],
                flags: [
                    ['s'],
                    ['Shuffles the playlist.']
                ]
            }
        }
    },
    minigames: {
        header: '### Minigame Commands ###',
        commands: {
            'stats': {
                description: 'Displays your gaming statistics. If none found, generates a user profile.',
                permissionLevel: 1,
            },
            'inv': {
                description: 'Displays your inventory amounts.',
                permissionLevel: 1,
            },
            'sell': {
                description: 'Sells all items in your inventory.',
                permissionLevel: 1,
            }
        },
        subcommands: {
            'fishing': {
                header: '### Fishing Minigame Commands ###',
                commands: {
                    'cast': {
                        description: 'Casts your fishing rod. Will return a result within a couple seconds.',
                        permissionLevel: 1,
                    }
                }
            },
            'gathering': {
                header: '### Gathering Minigame Commands ###',
                commands: {}
            },
            'mining': {
                header: '### Mining Minigame Commands ###',
                commands: {}
            },
            'gambling': {
                header: '### Gambling Minigame Commands ###',
                commands: {
                    'blackjack': {
                        description: 'Standard game of blackjack. Dealer rests at soft 17. 2x payout.',
                        permissionLevel: 1,
                        arguments: [
                            [' ', 'bet', 'fold', 'hit'],
                            [
                                'Without arguments, if a game is in progress, displays your hand.',
                                'Starts a game with given pay-in; must be a positive whole number.',
                                'Ends player draw period, dealer will draw until 17 or over.',
                                'Adds a card to your hand. Will end game if total is over 21.'
                            ]
                        ]
                    }
                }
            }
        }
    },
    memes: {
        header: '### MEMES, HELL YEAH! ###',
        commands: {
            'f': {
                description: 'Drops an f in the chat.',
                permissionLevel: 1,
            },
            'fuck': {
                description: 'Rage comic fuuuuu!',
                permissionLevel: 1,
            },
            'yey': {
                description: 'Rage comic yey!',
                permissionLevel: 1,
            },
            'crabrave': {
                description: 'Starts playing Crabrave by Noisestorm in the voice chat.',
                permissionLevel: 1,
                alternatives: ['cr'],
            },
        }
    }
};