module.exports = {
    main: {
        header: '### Help Commands ###\nUsage: help {subcommand} OR ? {subcommand}',
        commands: {
            'common': {
                description: 'General use commands.',
            },
            'rolemanager': {
                description: 'Role management commands.'
            },
            'music': {
                description: 'Music related commands.',
            },
            'playlist': {
                description: 'Playlist related commands.',
            },
            'minigames': {
                description: 'Minigames related commands. Try "help minigames {game}" for a specific minigame.'
            },
            'memes': {
                description: 'Meme commands. Just for fun.'
            },
            'dungeons': {
                description: 'Dungeons and dragons tools.'
            },
            page: [
                ['common', 'rolemanager', 'music', 'playlist', 'minigames', 'memes', 'dungeons'],
            ],
        },
    },
    common: {
        header: '### Common Commands ###',
        commands: {
            'clean': {
                description: 'Cleans the chat of bot messages and commands.',
                permissionLevel: 3,
                arguments: [
                    ['@Username'],
                    ['Optional; the user you want to remove messages for.']
                ],
            },
            'help': {
                description: 'Lists help, duh.',
                permissionLevel: 0,
                alternatives: ['?'],
            },
            'ping': {
                description: 'Gets the Discord latency (delay between send and edit) and bot-to-server latency.',
                permissionLevel: 0,
            },
            'roll': {
                description: 'Rolls a number between 1 and a provided value (default 6).',
                permissionLevel: 0,
                arguments: [
                    ['sides', 'count'],
                    ['Maximum value / sides of dice. 2 = coin flip.', 'How many times the action should be repeated. Default 1; max 50.']
                ]
            },
            'shuffle': {
                description: 'Shuffles everything after the command.',
                permissionLevel: 0,
                arguments: [
                    ['array'],
                    ['Comma-separated list of items wanted split. Ex: 1,2,3,4,5 | Ex: cat,dog,fish,bird,cow']
                ]
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
            page: [
                ['clean', 'help', 'ping', 'roll', 'shuffle', 'whoami', 'whoareyou'],
            ],
        }
    },
    rolemanager: {
        header: '### Role Manager Commands ###',
        commands: {
            'motd': {
                description: 'Gets the server Message of the Day.',
                permissionLevel: 0,
            },
            'setmotd': {
                description: 'Sets the server Message of the Day. Remains until executed again.',
                permissionLevel: 4,
                arguments: [
                    ['message'],
                    ['MOTD formatted as: First Title&tSome message.\\nA new line|Second Title&tSome message.<l>http://optional_link_for_header.com/\n&t - end of title; \\n - new line; <l> - header link (optional, at end)']
                ],
            },
            'prefixes': {
                description: 'Gets the server prefixes for commands.',
                permissionLevel: 0,
            },
            'setprefixes': {
                description: 'Sets the server prefixes for commands.',
                permissionLevel: 4,
                arguments: [
                    ['prefixes'],
                    ['String of characters without spaces. Leaving blank returns current.\n.-~ would be . or - or ~\nMaximum of 3 characters.'],
                ],
            },
            'promote': {
                description: 'Promotes the user 1 level. Can only promote to level 1 fewer than sender.',
                permissionLevel: 2,
                arguments: [
                    ['@user | userID'],
                    ['Ping of the target user | ID of the target user']
                ],
            },
            'demote': {
                description: 'Demotes the user 1 level. Can only demote to 0 (default) for users below sender.',
                permissionLevel: 2,
                arguments: [
                    ['@user | userID'],
                    ['Ping of the target user | ID of the target user']
                ],
            },
            'setbotadmin': {
                description: 'Gives user bot admin abilities (overrides permission levels). Use only for trusted users.',
                permissionLevel: 4,
                arguments: [
                    ['@user | userID'],
                    ['Ping of the target user | ID of the target user']
                ],
            },
            'setbotmod': {
                description: 'Gives user bot moderator abilities (overrides permission levels). Use only for trusted users.',
                permissionLevel: 4,
                arguments: [
                    ['@user | userID'],
                    ['Ping of the target user | ID of the target user']
                ],
            },
            'setbothelper': {
                description: 'Gives user bot helper abilities (overrides permission levels). Use only for trusted users.',
                permissionLevel: 4,
                arguments: [
                    ['@user | userID'],
                    ['Ping of the target user | ID of the target user']
                ],
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
                alternatives: ['revertban'],
                arguments: [
                    ['userID', 'reason'],
                    ['ID of the target user', 'Optional; if supplied, will list reason for pardon when checking user history.']
                ],
            },
            'pardon': {
                description: '"Pardons" the user under given punishment at given index. Does not affect total, does not remove from list.',
                permissionLevel: 4,
                arguments: [
                    ['@user | userID', 'punishment', 'index', 'reason'],
                    ['Ping of the target user | ID of the target user', 'warnings | kicks | bans', 'index from list. Use a listing command to find index.', 'Optional reason for pardon.']
                ],
            },
            'rm-reset': {
                description: 'Resets all user history (warnings, kicks, bans, reverts).',
                permissionLevel: 4,
                arguments: [
                    ['@user | userID'],
                    ['Ping of the target user | ID of the target user']
                ],
            },
            'fetchbans': {
                description: 'Returns a list of active server bans.',
                permissionLevel: 2,
            },
            'rm-info': {
                description: 'Provides user history of warnings, kicks, bans and ban reverts.',
                permissionLevel: 2,
                arguments: [
                    ['@user'],
                    ['Ping of the target user']
                ],
            },
            'rm-roleinfo': {
                description: 'Returns user role information.',
                permissionLevel: 2,
                arguments: [
                    ['@user | userID'],
                    ['Ping of the target user | ID of the target user']
                ],
            },
            'warnings': {
                description: 'Returns list of user warnings and reasons.',
                permissionLevel: 2,
                arguments: [
                    ['@user | userID'],
                    ['Ping of the target user | ID of the target user']
                ],
            },
            'kicks': {
                description: 'Returns list of user kicks and reasons.',
                permissionLevel: 2,
                arguments: [
                    ['@user | userID'],
                    ['Ping of the target user | ID of the target user']
                ],
            },
            'bans': {
                description: 'Returns list of user bans and reasons.',
                permissionLevel: 2,
                arguments: [
                    ['@user | userID'],
                    ['Ping of the target user | ID of the target user']
                ],
            },
            'banreverts': {
                description: 'Returns list of user pardons and reasons.',
                permissionLevel: 2,
                arguments: [
                    ['@user | userID'],
                    ['Ping of the target user | ID of the target user']
                ],
            },
            page: [
                ['motd', 'setmotd', 'prefixes', 'setprefixes', 'promote', 'demote'],
                ['warn', 'kick', 'ban', 'unban', 'rm-reset', 'pardon', 'setbotadmin', 'setbotmod', 'setbothelper'],
                ['fetchbans', 'rm-info', 'rm-roleinfo', 'warnings', 'kicks', 'bans', 'banreverts'],
            ]
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
                    ['url | query string'],
                    ['YouTube URL for a given video/song | Search for a video based on title (query). ~play Some song title']
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
            },
            'removefromqueue': {
                description: 'Removes element from the active queue (sets removed flag). Can undo with same command.',
                permissionLevel: 1,
                alternatives: ['rmqueue'],
            },
            'songinfo': {
                description: 'Gets information about a song without adding to the active queue.',
                permissionLevel: 1,
            },
            page: [
                ['join', 'leave', 'play', 'skip', 'stop', 'queue'],
                ['removefromqueue', 'songinfo']
            ],
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
                    ['Playlist name.']
                ],
            },
            'delete': {
                description: 'Deletes the playlist of the given name',
                permissionLevel: 2,
                arguments: [
                    ['name'],
                    ['Playlist name.']
                ],
            },
            'add': {
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
                    ['Playlist name; Song index (found using list command).']
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
            },
            page: [
                ['create', 'list', 'add', 'remove', 'play'],
            ],
        }
    },
    minigames: {
        header: '### Minigame Commands ###',
        commands: {
            'stats': {
                description: 'Displays your gaming statistics such as wins, losses, experience and money.',
                permissionLevel: 1,
            },
            'inv': {
                description: 'Displays your inventory amounts.',
                permissionLevel: 1,
            },
            'sell': {
                description: 'Sells all items in your inventory.',
                permissionLevel: 1,
            },
            page: [
                ['stats', 'inv', 'sell'],
            ],
        },
        subcommands: {
            'fishing': {
                header: '### Fishing Minigame Commands ###',
                commands: {
                    'cast': {
                        description: 'Casts your fishing rod. Will return a result within a couple seconds.',
                        permissionLevel: 1,
                    },
                    page: [
                        ['cast'],
                    ],
                }
            },
            'gathering': {
                header: '### Gathering Minigame Commands ###',
                commands: { page: [[],], },
            },
            'mining': {
                header: '### Mining Minigame Commands ###',
                commands: { page: [[],], },
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
                    },
                    'slots': {
                        description: 'Roll some slots, bet away your hard earned savings.',
                        permissionLevel: 1,
                        arguments: [
                            ['bet', 'roll amount'],
                            [
                                'Starts a game with given pay-in; must be a positive whole number.',
                                'Count of times the slots should be run. Will divide pay-in evenly throughout ($20 for 2 spins = $10 each spin).'
                            ]
                        ]
                    },
                    page: [
                        ['blackjack', 'slots'],
                    ],
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

            'penguin': {
                description: 'Penguin giffy. <3',
                permission: 1,
            },
            'clayhead': {
                description: 'I am not sorry for anything or anyone.',
                permission: 1,
            },

            'crabrave': {
                description: 'Starts playing Crabrave by Noisestorm in the voice chat.',
                permissionLevel: 1,
                alternatives: ['cr'],
            },
            page: [
                ['f', 'fuck', 'yey'],
                ['penguin', 'clayhead'],
                ['crabrave'],
            ],
        }
    },
    dungeons: {
        header: '### D&D ###',
        commands: {
            'dd_getitem': {
                description: 'Get an item details, worth per pound.',
                permissionLevel: 1,
                arguments: [
                    ['ItemName'],
                    ['Name of the item. Capitalization matters (for now).']
                ]
            },
            'dd_getshop': {
                description: 'Get a shop listing.',
                permissionLevel: 1,
            },
            'dd_list': {
                description: 'Get a list of items per category.',
                permissionLevel: 1,
                arguments: [
                    ['Category name or abreviation.'],
                    ['AF, AG, AMMO, DF, EP, FRW, G, HA, HS, LA, M, MA, MMW, MRW, P, PO, S, SMW, SRW, T, VL, VW']
                ]
            },
            'dd_loaditems': {
                description: 'Manually loads item list from file.',
                permissionLevel: 2,
            },
            page: [
                ['dd_getitem', 'dd_getshop', 'dd_list'],
                ['dd_loaditems']
            ]
        }
    }
};