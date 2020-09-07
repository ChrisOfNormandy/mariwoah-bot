module.exports = {
    main: {
        header: '### Help Commands ###\nUsage: help {subcommand} OR ? {subcommand}\nArguments marked * are optional.',
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
            // 'dungeons': {
            //     description: 'Dungeons and dragons tools.'
            // },
            'guild': {
                description: 'Guild commands for Discord roles.'
            },
            'syntaxes': {
                description: 'Available parameters and flags used in commands.'
            },
            page: [
                [
                    'common',
                    'rolemanager',
                    'music',
                    'playlists',
                    'minigames',
                    'memes',
                    'guild',
                    'syntaxes'
                ]
            ]
        },
    },
    common: {
        header: '### Common Commands ###',
        commands: {
            'clean': {
                description: 'Cleans the chat! Without arguments cleans bot messages and commands. With pinged user(s) will clean only their messages.',
                permissionLevel: 3,
                arguments: [
                    [
                        '*@user(s)'
                    ],
                    [
                        'User ping(s).'
                    ]
                ]
            },
            'help': {
                description: 'Lists help and syntaxes',
                permissionLevel: 0,
                alternatives: [
                    '?'
                ],
                selfClear: true
            },
            'ping': {
                description: 'Gets the Discord message latency (delay between send and edit) for the bot.',
                permissionLevel: 0,
                selfClear: true
            },
            'fetchemoji': {
                description: 'Fetches an emoji by name from any of the servers the bot is in.',
                permissionLevel: 0,
                selfClear: true
            },
            'roll': {
                description: 'Gets a number between 1 and a provided value (default 6) a given amount of times (default once).',
                permissionLevel: 0,
                arguments: [
                    [
                        '*sides',
                        '*count'
                    ],
                    [
                        'Maximum value / sides of die; min 2 = coin flip.',
                        'How many times the action should be repeated; max 50.'
                    ]
                ]
            },
            'shuffle': {
                description: 'Shuffles everything after the command separated by commas (no space).',
                permissionLevel: 0,
                arguments: [
                    [
                        'array'
                    ],
                    [
                        'List of items wanted split. Ex: 1,2,3,4,5 or cat,dog,fish,bird,cow.'
                    ]
                ]
            },
            'whoami': {
                description: 'Lists your  name and discriminator (#number), server join date, roles and other info.',
                permissionLevel: 0,
                selfClear: true
            },
            'whoareyou': {
                description: `Lists a user's  name and discriminator (#number), server join date, roles and other info.`,
                permissionLevel: 0,
                arguments: [
                    [
                        '@user'
                    ],
                    [
                        'Ping user you want information about.'
                    ]
                ],
                selfClear: true
            },
            'motd': {
                description: 'Get the server Message of the Day.',
                permissionLevel: 0,
                selfClear: true
            },
            'setmotd': {
                description: 'Set the server Message of the Day. Remains until reset',
                permissionLevel: 4,
                arguments: [
                    [
                        'JSON'
                    ],
                    [
                        'A stringified JSON for your message.'
                    ]
                ],
                selfClear: true
            },
            'prefix': {
                description: 'Get the server command prefix.',
                permissionLevel: 0,
                selfClear: true
            },
            'setprefix': {
                description: 'Set the server command prefix.',
                permissionLevel: 4,
                arguments: [
                    [
                        'character'
                    ],
                    [
                        'Any single character.'
                    ],
                ],
                selfClear: true
            },
            'timeout': {
                description: '',
                permissionLevel: 4
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
                description: 'Issue a user a warning',
                permissionLevel: 2,
                arguments: [
                    [
                        '@user | user ID',
                        '*reason'
                    ],
                    [
                        'User ping | User ID.',
                        'Reason for warning. Provide using: $reason:"Your reason."'
                    ]
                ]
            },
            'warnings': {
                description: 'Return a list of user warnings.',
                permissionLevel: 2,
                arguments: [
                    [
                        '@user | user ID'
                    ],
                    [
                        'User ping | User ID.'
                    ]
                ],
                selfClear: true
            },
            'kick': {
                description: 'Kick a user from the server.',
                permissionLevel: 3,
                arguments: [
                    [
                        '@user | user ID',
                        '*reason'
                    ],
                    [
                        'User ping | User ID',
                        'Reason for kick. Provide using: $reason:"Your reason."'
                    ]
                ]
            },
            'kicks': {
                description: 'Return a list of user kicks.',
                permissionLevel: 2,
                arguments: [
                    [
                        '@user | user ID'
                    ],
                    [
                        'User ping | User ID.'
                    ]
                ],
                selfClear: true
            },
            'ban': {
                description: 'Ban a user from the Discord. Requires an unban to undo.',
                permissionLevel: 4,
                arguments: [
                    [
                        '@user | user ID',
                        '*reason'
                    ],
                    [
                        'User ping | User ID.',
                        'Reason for ban. Provide using: $reason:"Your reason."'
                    ]
                ]
            },
            'bans': {
                description: 'Return a list of user bans.',
                permissionLevel: 2,
                arguments: [
                    [
                        '@user | user ID'
                    ],
                    [
                        'User ping | User ID.'
                    ]
                ],
                selfClear: true
            },
            'unban': {
                description: 'Return a list of user bans.',
                permissionLevel: 4,
                arguments: [
                    [
                        'user ID'
                    ],
                    [
                        'User ID.'
                    ]
                ]
            },
            'promote': {
                description: 'Promote a user.',
                permissionLevel: 4,
                arguments: [
                    [
                        '@user',
                        '*level'
                    ],
                    [
                        'User ping.',
                        'Rank number between 0 (default) and 4 (admin).'
                    ]
                ],
                selfClear: true
            },
            'demote': {
                description: 'Demote a user.',
                permissionLevel: 4,
                arguments: [
                    [
                        '@user',
                        '*level'
                    ],
                    [
                        'User ping.',
                        'Rank number between 0 (default) and 4 (admin).'
                    ]
                ],
                selfClear: true
            },
            'setbotadmin': {
                description: 'Development feature only, does nothing for users.',
                permissionLevel: 4,
                arguments: [
                    [
                        '@user'
                    ],
                    [
                        'User ping.'
                    ]
                ],
                selfClear: true
            },
            'setbotmod': {
                description: 'Development feature only, does nothing for users.',
                permissionLevel: 4,
                arguments: [
                    [
                        '@user'
                    ],
                    [
                        'User ping.'
                    ]
                ],
                selfClear: true
            },
            'setbothelper': {
                description: 'Development feature only, does nothing for users.',
                permissionLevel: 4,
                arguments: [
                    [
                        '@user'
                    ],
                    [
                        'User ping.'
                    ]
                ],
                selfClear: true
            },
            'refreshrole': {
                description: 'Refresh roles for a user by removing and adding appropriately.',
                permissionLevel: 4,
                arguments: [
                    [
                        '*@user'
                    ],
                    [
                        'User ping, defaults to self.'
                    ]
                ],
                selfClear: true
            },
            'refreshroles': {
                description: 'Refresh roles for all users in the server. Will take time for larger servers.',
                permissionLevel: 4,
                selfClear: true
            },
            'resetroles': {
                description: 'Remove the roles used by the bot for each member in the server. Will take time for larger servers.',
                permissionLevel: 4,
                selfClear: true
            },
            'purgeroles': {
                description: 'USE WITH CAUTION - Delete all roles from the server (except the bot default role and @everyone).',
                permissionLevel: 4,
                selfClear: true
            },
            'setrole': {
                description: 'Distinguish a role to a specific rank.',
                permissionLevel: 4,
                arguments: [
                    [
                        'roleName',
                        '@role'
                    ],
                    [
                        'bot, vip, helper, mod, admin', 'Role ping.'
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
                ],
                [
                    'refreshrole',
                    'refreshroles',
                    'resetroles',
                    'purgeroles',
                    'setrole'
                ]
            ]
        }
    },
    music: {
        header: '### Music Commands ###',
        commands: {
            'join': {
                description: 'Put the bot into your current voice channel.',
                permissionLevel: 1,
                selfClear: true
            },
            'play': {
                description: 'Play music in your current voice channel.',
                permissionLevel: 1,
                arguments: [
                    [
                        'url(s) | video name | playlist name'
                    ],
                    [
                        'YouTube URL(s) | Video title | Playlist title (requires flag).'
                    ]
                ],
                flags: [
                    [
                        's',
                        'n',
                        'f',
                        'p'
                    ],
                    [
                        'Shuffle the list of URLs.',
                        'Do not output embeded messages to the chat.',
                        'Only output the first embed, if no other songs in queue.',
                        'Search for a YouTube playlist instead of a single video.'
                    ]
                ],
                alternatives: [
                    'p'
                ],
                selfClear: true
            },
            'leave': {
                description: 'Remove the bot from current voice channel.',
                permissionLevel: 2,
                selfClear: true
            },
            'skip': {
                description: 'Skip the current song, will play next if another song is available in the queue.',
                permissionLevel: 1,
                selfClear: true
            },
            'stop': {
                description: 'Clear the music queue and disconnect the bot from the current voice channel.',
                permissionLevel: 1,
                selfClear: true
            },
            'queue': {
                description: 'List the current music queue.',
                permissionLevel: 1,
                alternatives: [
                    'q'
                ],
                flags: [
                    [
                        'l'
                    ],
                    [
                        'List songs in the queue using their URL instead of title.'
                    ]
                ],
                selfClear: true
            },
            'pause': {
                description: 'Pause the current song.',
                permissionLevel: 1,
                selfClear: true
            },
            'resume': {
                description: 'Resume the paused song.',
                permissionLevel: 1,
                selfClear: true
            },
            'songinfo': {
                description: 'Get information about a song.',
                permissionLevel: 1,
                arguments: [
                    [
                        'url | video name | "this"'
                    ],
                    [
                        'YouTube video URL | Video title | Without quotes, current song in queue if available'
                    ]
                ],
                alternatives: [
                    'song?'
                ],
                selfClear: true
            },
            'playlist': {
                description: 'Playlist commands, requires subcommand.',
                permissionLevel: 1, // Minimum level
                selfClear: true,
                alternatives: [
                    'pl'
                ],
                subcommands: {
                    'create': {
                        description: 'Create a playlist.',
                        permissionLevel: 2,
                        arguments: [
                            [
                                'name'
                            ],
                            [
                                'Playlist name, single word.'
                            ]
                        ],
                        selfClear: true
                    },
                    'delete': {
                        description: 'Delete a playlist.',
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
                        description: 'Add a video to a playlist.',
                        permissionLevel: 2,
                        arguments: [
                            [
                                'name',
                                'Video URL(s) | Video name'
                            ],
                            [
                                'Playlist name.',
                                'YouTube video URL(s) | YouTube video title.'
                            ]
                        ],
                        selfClear: true
                    },
                    'list': {
                        description: 'List server playlists or videos in a playlist.',
                        permissionLevel: 1,
                        arguments: [
                            [
                                '*name'
                            ],
                            [
                                'List all videos in a playlist, by default lists all server playlist names.'
                            ]
                        ],
                        selfClear: true
                    },
                    'remove': {
                        description: 'Remove a video from a playlist.',
                        permissionLevel: 2,
                        arguments: [
                            [
                                'name',
                                'url'
                            ],
                            [
                                'Playlist name.',
                                'Video URL.'
                            ]
                        ],
                        selfClear: true
                    },
                    'play': {
                        description: 'Add all songs in a playlist to the music queue.',
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
                                'Shuffle the playlist before adding to queue'
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
                description: 'Get minigame statistics.',
                permissionLevel: 1,
                selfClear: true
            },
            'cast': {
                description: 'Play the fishing minigame.',
                permissionLevel: 1
            },
            'inventory': {
                description: 'List your minigame inventory.',
                permissionLevel: 1,
                alternatives: [
                    'inv'
                ],
                selfClear: true
            }
        },
        page: [
            [
                'stats',
                'cast',
                'inventory'
            ]
        ]
    },
    memes: {
        header: '### MEMES ###',
        commands: {
            'f': {
                description: 'Drop an f in the chat.',
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
            'bird': {
                description: 'Bird. Dance.',
                permissionLevel: 1,
                selfClear: true
            },
            'clayhead': {
                description: 'I fear nothing.',
                permissionLevel: 1,
                selfClear: true
            },
            'extrathicc': {
                description: 'I fear nothing.',
                permissionLevel: 1,
                selfClear: true
            },
            'thowonk': {
                description: 'I fear nothing.',
                permissionLevel: 1,
                selfClear: true
            },

            'crabrave': {
                description: 'Play Crabrave by Noisestorm in the current voice channel.',
                permissionLevel: 1,
                alternatives: [
                    'cr'
                ],
                selfClear: true
            },
            'theriddle': {
                description: 'Play The Riddle by Gigi D\'Agostino in the current voice channel.',
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
                    'clayhead',
                    'bird'
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
    guild: {
        header: '### Guilds ###',
        commands: {
            'guild': {
                description: 'Displays guild information.',
                permissionLevel: 0,
                parameters: {
                    string: {
                        '*name': 'The guild name. By default shows current guild information.'
                    }
                },
                selfClear: true
            },
            page: [
                [
                    'guild'
                ]
            ]
        },
        subcommands: {
            'help': {
                description: 'Some basic guidance on the basics of the bot and guilds.',
                permissionLevel: 0,
                selfClear: true
            },
            'create': {
                description: 'Create a new guild. Will be established when it reaches a total of at least 3 members.',
                permissionLevel: 0,
                parameters: {
                    string: {
                        'name': 'Guild name; must be equal or fewer than 32 characters.',
                        '*color': 'Guild color; must be a valid hex color code such as #ffffff or #000000.'
                    }
                },
                flags: {
                    'p': 'Creates the guild as publicly joinable. By default, guilds are created as invite-only / private.'
                },
                selfClear: true
            },
            'seticon': {
                description: 'Leaders only; changes the guild icon.',
                permissionLevel: 0,
                arguments: [
                    [
                        'URL'
                    ],
                    [
                        'A valid image url (usally ends with .jpg, .png, etc...); can be a discord image link, as long as the image is not deleted.'
                    ]
                ],
                selfClear: true
            },
            'setcolor': {
                description: 'Leaders only; changes the guild color (in the guild display embed and the role color).',
                permissionLevel: 0,
                arguments: [
                    [
                        'Hex color code'
                    ],
                    [
                        'Any hex color code. Will allow names in the future. Format: # followed by 6 numbers (0-9) or letters (a-f).'
                    ]
                ],
                selfClear: true
            },
            'setlore': {
                description: 'Leaders only; changes the guild lore.',
                permissionLevel: 0,
                arguments: [
                    [
                        'Text'
                    ],
                    [
                        'Any amount of text. If left blank, will reset to default (empty).'
                    ]
                ],
                selfClear: true
            },
            'setmotto': {
                description: 'Leaders only; changes the guild motto.',
                permissionLevel: 0,
                arguments: [
                    [
                        'Text'
                    ],
                    [
                        'Any amount of text. If left blank, will reset to default.'
                    ]
                ],
                selfClear: true
            },
            'lore': {
                description: 'Displays the lore of a guild.',
                permissionLevel: 0,
                parameters: {
                    string: {
                        '*name': 'The name of a guild. If ignored, gets the lore for the guild of the current user.'
                    }
                },
                selfClear: true
            },
            'list': {
                description: 'Displays a list of all guilds in the Discord.',
                permissionLevel: 0,
                selfClear: true
            },
            'join': {
                description: 'Places the user under the leadership of a guild.',
                permissionLevel: 0,
                arguments: [
                    [
                        'Guild name'
                    ],
                    [
                        'The name of the guild you wish to join.'
                    ]
                ],
                selfClear: true
            },
            'leave': {
                description: 'Releashes the user from the leadership of a guild.',
                permissionLevel: 0,
                selfClear: true
            },
            'invite': {
                description: 'Leaders and officers only; invite members to join the guild.',
                permissionLevel: 0,
                arguments: [
                    [
                        '@user'
                    ],
                    [
                        'User ping'
                    ]
                ],
                selfClear: true
            },
            'toggle': {
                description: 'Leaders only; toggles the invite requirement of the guild.',
                permissionLevel: 0,
                selfClear: true
            },
            'invites': {
                description: 'Lists all invites extended to a user.',
                permissionLevel: 0,
                selfClear: true
            },
            'deny': {
                description: 'Reject an extended invite. A new one can be redelievered.',
                permissionLevel: 0,
                parameters: {
                    string: {
                        'name': 'Name of the guild you wish to reject active invites.'
                    }
                },
                selfClear: true
            },
            'setleader': {
                description: 'Leaders only; changes the guild role for a user to Leader - does not change their title.',
                permissionLevel: 0,
                arguments: [
                    [
                        '@user'
                    ],
                    [
                        'Ping of a user'
                    ]
                ],
                selfClear: true
            },
            'setofficer': {
                description: 'Leaders only; changes the guild role for a user to Officer - does not change their title.',
                permissionLevel: 0,
                arguments: [
                    [
                        '@user'
                    ],
                    [
                        'Ping of a user'
                    ]
                ],
                selfClear: true
            },
            'setmember': {
                description: 'Leaders only; changes the guild role for a user to Member - does not change their title.',
                permissionLevel: 0,
                arguments: [
                    [
                        '@user'
                    ],
                    [
                        'Ping of a user'
                    ]
                ],
                selfClear: true
            },
            'exhile': {
                description: 'Leaders only; exhiles a player in a guild. They remain under its leadership, but have no power unless they leave.',
                permissionLevel: 0,
                arguments: [
                    [
                        '@user'
                    ],
                    [
                        'Ping of a user'
                    ]
                ],
                selfClear: true
            },
            'settitle': {
                description: 'Leaders only; changes the title of a user.',
                permissionLevel: 0,
                parameters: {
                    string: {
                        'title': 'Whatever title is desired.'
                    }
                },
                selfClear: true
            },
            page: [
                [
                    'create',
                    'list',
                    'join',
                    'leave',
                    'invites',
                    'deny',
                    'lore'
                ],
                [
                    'icon',
                    'color',
                    'setlore',
                    'setmotto',
                    'invite',
                    'toggle'
                ],
                [
                    'exhile',
                    'setmember',
                    'setofficer',
                    'setleader',
                    'settitle'
                ]
            ]
        }
    },
    guild_admin: {
        header: '### Admin-only Commands for Guilds ###',
        commands: {},
        subcommands: {
            'other_join': {
                description: 'Forces members to join a guild.',
                permissionLevel: 4,
                arguments: [
                    [
                        '@user(s)'
                    ],
                    [
                        'Ping(s) of user(s).'
                    ]
                ]
            },
            'other_leave': {
                description: 'Forces members to leave a guild.',
                permissionLevel: 4,
                arguments: [
                    [
                        '@user(s)'
                    ],
                    [
                        'Ping(s) of user(s).'
                    ]
                ]
            },
            'refresh': {
                description: 'Forces members into a guild.',
                permissionLevel: 4,
            },
            'disband': {
                description: 'Deletes a guild.',
                permissionLevel: 4,
                parameters: {
                    string: {
                        'name': 'Guild name.'
                    }
                }
            }
        }
    },
    syntaxes: {
        header: '### Parameters and Flags ###',
        parameters: {
            string: {
                'reason': 'Provides a reason to commands that use one.',
                'name': 'Provides the name of an object.'
            },
            boolean: {
                'debug': 'Not very helpful, just outputs a stringified JSON of the return value if available.',
                'json': 'Outputs JSON string if available.'
            }
        },
        flags: {
            global: {
                'C': 'Do not remove message if the command has auto-clear enabled.'
            }
        }
    }
};