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
            'playlists': {
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
            'parameters': {
                description: 'Available parameters used in commands.'
            },
            page: [
                [
                    'common',
                    'rolemanager',
                    'music',
                    'playlists',
                    'minigames',
                    'memes',
                    'dungeons',
                    'parameters'
                ]
            ]
        },
    },
    common: {
        header: '### Common Commands ###',
        commands: {
            'clean': {
                description: 'Cleans the chat of bot messages and commands.',
                permissionLevel: 3,
                arguments: [
                    [
                        '@Username(s)'
                    ],
                    [
                        'Optional; Removes messages of mentioned user(s).'
                    ]
                ]
            },
            'help': {
                description: 'Lists help.',
                permissionLevel: 0,
                alternatives: [
                    '?'
                ],
                selfClear: true
            },
            'ping': {
                description: 'Gets the Discord latency (delay between send and edit) and bot-to-server latency.',
                permissionLevel: 0,
                selfClear: true
            },
            'roll': {
                description: 'Rolls a number between 1 and a provided value (default 6).',
                permissionLevel: 0,
                arguments: [
                    [
                        'sides',
                        'count'
                    ],
                    [
                        'Maximum value / sides of dice. 2 = coin flip.',
                        'How many times the action should be repeated. Default 1; max 50.'
                    ]
                ]
            },
            'shuffle': {
                description: 'Shuffles everything after the command.',
                permissionLevel: 0,
                arguments: [
                    [
                        'array'
                    ],
                    [
                        'Comma-separated list of items wanted split. Ex: 1,2,3,4,5 | Ex: cat,dog,fish,bird,cow'
                    ]
                ]
            },
            'whoami': {
                description: 'Lists your Discord name and discriminator (#numb), server join date and roles.',
                permissionLevel: 0,
                selfClear: true
            },
            'whoareyou': {
                description: 'Lists a user Discord name and discriminator (#numb), server join date and roles.',
                permissionLevel: 0,
                arguments: [
                    [
                        '@Username'
                    ],
                    [
                        'The user you want information about.'
                    ]
                ],
                selfClear: true
            },
            'motd': {
                description: 'Gets the server Message of the Day.',
                permissionLevel: 0,
                selfClear: true
            },
            'setmotd': {
                description: 'Sets the server Message of the Day. Remains until executed again.',
                permissionLevel: 4,
                arguments: [
                    [
                        'message'
                    ],
                    [
                        'MOTD formatted as: First Title&tSome message.\\nA new line|Second Title&tSome message.<l>http://optional_link_for_header.com/\n&t - end of title; \\n - new line; <l> - header link (optional, at end)'
                    ]
                ],
                selfClear: true
            },
            'prefix': {
                description: 'Gets the server prefixes for commands.',
                permissionLevel: 0,
                selfClear: true
            },
            'setprefix': {
                description: 'Sets the server prefixes for commands.',
                permissionLevel: 4,
                arguments: [
                    [
                        'prefixes'
                    ],
                    [
                        'String of characters without spaces. Leaving blank returns current.\n.-~ would be . or - or ~\nMaximum of 3 characters.'
                    ],
                ],
                selfClear: true
            },
            page: [
                [
                    'clean',
                    'help',
                    'ping',
                    'roll',
                    'shuffle',
                    'whoami',
                    'whoareyou'
                ],
                [
                    'motd',
                    'setmotd',
                    'prefix',
                    'setprefix'
                ]
            ]
        }
    },
    rolemanager: {
        header: '### Role Manager Commands ###',
        commands: {
            'warn': {
                description: 'Warns the user with or without a specified reason.',
                permissionLevel: 2,
                arguments: [
                    [
                        '@user | userID',
                        'reason'
                    ],
                    [
                        'Ping of the target user | ID of the target user.',
                        'Optional; if supplied, will list reason for warning when checking user history.'
                    ]
                ]
            },
            'warnings': {
                description: 'Returns list of user warnings and reasons.',
                permissionLevel: 2,
                arguments: [
                    [
                        '@user | userID'
                    ],
                    [
                        'Ping of the target user | ID of the target user.'
                    ]
                ],
                selfClear: true
            },
            'kick': {
                description: 'Kicks the user with or without a specified reason.',
                permissionLevel: 3,
                arguments: [
                    [
                        '@user | userID',
                        'reason'
                    ],
                    [
                        'Ping of the target user | ID of the target user',
                        'Optional; if supplied, will list reason for warning when checking user history.'
                    ]
                ]
            },
            'kicks': {
                description: 'Returns list of user kicks and reasons.',
                permissionLevel: 2,
                arguments: [
                    [
                        '@user | userID'
                    ],
                    [
                        'Ping of the target user | ID of the target user.'
                    ]
                ],
                selfClear: true
            },
            'ban': {
                description: 'Bans the user with or without a specified reason.',
                permissionLevel: 4,
                arguments: [
                    [
                        '@user | userID',
                        'reason'
                    ],
                    [
                        'Ping of the target user | ID of the target user.',
                        'Optional; if supplied, will list reason for warning when checking user history.'
                    ]
                ]
            },
            'bans': {
                description: 'Returns list of user bans and reasons.',
                permissionLevel: 2,
                arguments: [
                    [
                        '@user | userID'
                    ],
                    [
                        'Ping of the target user | ID of the target user.'
                    ]
                ],
                selfClear: true
            },
            'unban': {
                description: 'Returns list of user bans and reasons.',
                permissionLevel: 4,
                arguments: [
                    [
                        'userID'
                    ],
                    [
                        'ID of the target user.'
                    ]
                ]
            },
            'promote': {
                description: 'Returns list of user bans and reasons.',
                permissionLevel: 4,
                arguments: [
                    [
                        '@user'
                    ],
                    [
                        'Ping of the target user'
                    ]
                ],
                selfClear: true
            },
            'demote': {
                description: 'Returns list of user bans and reasons.',
                permissionLevel: 4,
                arguments: [
                    [
                        '@user'
                    ],
                    [
                        'Ping of the target user'
                    ]
                ],
                selfClear: true
            },
            'setbotadmin': {
                description: 'Returns list of user bans and reasons.',
                permissionLevel: 4,
                arguments: [
                    [
                        '@user'
                    ],
                    [
                        'Ping of the target user'
                    ]
                ],
                selfClear: true
            },
            'setbotmod': {
                description: 'Returns list of user bans and reasons.',
                permissionLevel: 4,
                arguments: [
                    [
                        '@user'
                    ],
                    [
                        'Ping of the target user'
                    ]
                ],
                selfClear: true
            },
            'setbothelper': {
                description: 'Returns list of user bans and reasons.',
                permissionLevel: 4,
                arguments: [
                    [
                        '@user'
                    ],
                    [
                        'Ping of the target user'
                    ]
                ],
                selfClear: true
            },
            'refreshrole': {
                description: 'Refreshes the roles of the member by removing and adding appropriately.',
                permissionLevel: 4,
                arguments: [
                    [
                        '@user'
                    ],
                    [
                        'Optional; Ping of the target user, defaults to self.'
                    ]
                ],
                selfClear: true
            },
            'refreshroles': {
                description: 'Refreshes the roles for each member in the server. Does induce lag.',
                permissionLevel: 4,
                selfClear: true
            },
            'resetroles': {
                description: 'Resets the roles for each member in the server. Does induce lag.',
                permissionLevel: 4,
                selfClear: true
            },
            'purgeroles': {
                description: 'USE WITH CAUTION; Deletes all roles from the server (except default bot role and @everyone).',
                permissionLevel: 4,
                selfClear: true
            },
            'setrole': {
                description: 'Distinguishes a role to a specific rank.',
                permissionLevel: 4,
                arguments: [
                    [
                        'roleName', '@role'
                    ],
                    [
                        'bot, vip, helper, mod, admin', 'Ping of the target role.'
                    ]
                ],
                selfClear: true
            },
            page: [
                [
                    'warn',
                    'kick',
                    'ban',
                    'unban'
                ],
                [
                    'warnings',
                    'kicks',
                    'bans'
                ],
                [
                    'promote',
                    'demote',
                    'setbotadmin',
                    'setbotmod',
                    'setbothelper'
                ]
            ]
        }
    },
    music: {
        header: '### Music Commands ###',
        commands: {
            'join': {
                description: 'Puts the bot into your active voice chat. You must be connected to a voice chat to work.',
                permissionLevel: 1,
                selfClear: true
            },
            'play': {
                description: 'Plays music in the voice channel the user is in.',
                permissionLevel: 1,
                arguments: [
                    [
                        'url(s) | song name'
                    ],
                    [
                        'YouTube URL(s) | Search for a video based on title.'
                    ]
                ],
                flags: [
                    [
                        's',
                        'n',
                        'f'
                    ],
                    [
                        'Shuffle the list of URLs.',
                        'Do not output embeded messages to the chat.',
                        'Only output the first embed, if no other songs in queue.'
                    ]
                ],
                alternatives: [
                    'p'
                ],
                selfClear: true
            },
            'leave': {
                description: 'Kicks the bot out of its active voice chat.',
                permissionLevel: 2,
                selfClear: true
            },
            'skip': {
                description: 'Skips the current song, plays next if another available in queue.',
                permissionLevel: 1,
                selfClear: true
            },
            'stop': {
                description: 'Clears the music queue and disconnects the bot from the voice channel.',
                permissionLevel: 1,
                selfClear: true
            },
            'queue': {
                description: 'Lists the current music queue.',
                permissionLevel: 1,
                alternatives: [
                    'q'
                ],
                selfClear: true
            },
            'pause': {
                description: 'Pauses the active playing music.',
                permissionLevel: 1,
                selfClear: true
            },
            'resume': {
                description: 'Resumes the paused music.',
                permissionLevel: 1,
                selfClear: true
            },
            'playlist': {
                description: 'Playlist commands.',
                permissionLevel: 1,
                selfClear: true,
                alternatives: [
                    'pl'
                ],
                subcommands: {
                    'create': {
                        description: 'Creates a playlist of the given name.',
                        permissionLevel: 2,
                        arguments: [
                            [
                                'name'
                            ],
                            [
                                'Playlist name.'
                            ]
                        ],
                        selfClear: true
                    },
                    'delete': {
                        description: 'Deletes the playlist of the given name',
                        permissionLevel: 2,
                        arguments: [
                            [
                                'name'
                            ],
                            [
                                'Playlist name.'
                            ]
                        ],
                        selfClear: true
                    },
                    'add': {
                        description: 'Adds URL to the playlist of the given name.',
                        permissionLevel: 2,
                        arguments: [
                            [
                                'name',
                                'url'
                            ],
                            [
                                'Playlist name',
                                'YouTube URL for a given video/song.'
                            ]
                        ],
                        selfClear: true
                    },
                    'list': {
                        description: '...',
                        permissionLevel: 1,
                        arguments: [
                            [
                                'name'
                            ],
                            [
                                '*Optional; Lists all songs in the named playlist, empty lists all playlists.'
                            ]
                        ],
                        flags: [
                            [
                                'l'
                            ],
                            [
                                'Includes video URL.'
                            ]
                        ],
                        selfClear: true
                    },
                    'remove': {
                        description: 'Removes the song at given index from the named playlist.',
                        permissionLevel: 2,
                        arguments: [
                            [
                                'name index'
                            ],
                            [
                                'Playlist name; Song index (found using list command).'
                            ]
                        ],
                        selfClear: true
                    },
                    'play': {
                        description: 'Adds all songs in the named playlist to the music queue.',
                        permissionLevel: 1,
                        arguments: [
                            [
                                'name'
                            ],
                            [
                                'Playlist name.'
                            ]
                        ],
                        flags: [
                            [
                                's'
                            ],
                            [
                                'Shuffles the playlist.'
                            ]
                        ],
                        selfClear: true
                    }
                }
            },
            page: [
                [
                    'join',
                    'leave',
                    'play',
                    'skip',
                    'stop',
                    'queue',
                    'pause',
                    'resume',
                    'playlist'
                ]
            ]
        }
    },
    minigames: {
        header: '### Minigame Commands ###',
        commands: {
            'stats': {
                description: '',
                permissionLevel: 1,
                selfClear: true
            },
            'cast': {
                description: '',
                permissionLevel: 1,
                selfClear: true
            },
            'inventory': {
                description: '',
                permissionLevel: 1,
                alternatives: [
                    'inv'
                ],
                selfClear: true
            }
        },
        page: [
            [
                'stats'
            ]
        ]
    },
    memes: {
        header: '### MEMES ###',
        commands: {
            'f': {
                description: 'Drops an f in the chat.',
                permissionLevel: 1,
                selfClear: true
            },
            'fuck': {
                description: 'Rage comic fuuuuu!',
                permissionLevel: 1,
                selfClear: true
            },
            'yey': {
                description: 'Rage comic yey!',
                permissionLevel: 1,
                selfClear: true
            },

            'penguin': {
                description: 'Penguin giffy. <3',
                permissionLevel: 1,
                selfClear: true
            },
            'clayhead': {
                description: 'I am not sorry for anything or anyone.',
                permissionLevel: 1,
                selfClear: true
            },

            'crabrave': {
                description: 'Starts playing Crabrave by Noisestorm in the voice chat.',
                permissionLevel: 1,
                alternatives: [
                    'cr'
                ],
                selfClear: true
            },
            'theriddle': {
                description: 'Starts playing The Riddle by Gigi D\'Agostino in the voice chat.',
                permissionLevel: 1,
                selfClear: true
            },
            page: [
                [
                    'f',
                    'fuck',
                    'yey'
                ],
                [
                    'penguin',
                    'clayhead'
                ],
                [
                    'crabrave',
                    'theriddle'
                ],
            ],
        }
    },
    dungeons: {
        header: '### D&D ###',
        commands: {}
    },
    parameters: {
        header: '### PARAMETERS ###',
        type: {
            string: {
                
            },
            boolean: {
                'json': 'Outputs JSON string if available.'
            }
        }
    }
};