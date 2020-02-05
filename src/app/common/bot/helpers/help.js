module.exports = {
    main: {
        header: '### Help Commands ###\nUsage: ~help {subcommand} OR ~? {subcommand}\n_Allowed prefixes:_ . - ~',
        commands: {
            'common': {
                str: 'General use commands.',
            },
            'roleManager': {
                str: 'Role management commands.'
            },
            'music': {
                str: 'Music related commands.',
            },
            'playlist': {
                str: 'Playlist related commands.',
            },
            'minigames': {
                str: 'Minigames related commands. Try ~help minigames {game} for a specific minigame.'
            },
            'memes': {
                str: 'Meme commands. Just for fun.'
            }
        }
    },
    common: {
        header: '### Common Commands ###',
        commands: {
            'ping': {
                str: 'Gets the Discord latency (delay between send and edit) and bot-to-server latency.',
            },
            'clean': {
                str: 'Cleans the chat of bot messages and commands.',
                args: [
                    ['@Username'],
                    ['The user you want to remove messages for.']
                ],
                admin: true,
            },
            'help': {
                str: 'Lists help, duh.',
                alts: ['?'],
            },
            'whoami': {
                str: 'Lists your Discord name and discriminator (#numb), server join date and roles.'
            },
            'whoareyou': {
                str: 'Lists a user Discord name and discriminator (#numb), server join date and roles.',
                args: [
                    ['@Username'],
                    ['The user you want information about.']
                ]
            }
        }
    },
    roleManager: {
        header: '### Role Manager Commands ###',
        commands: {
            'warn': {
                str: 'Warns the user with or without a specified reason.',
                args: [
                    ['@user', 'reason'],
                    ['Ping of the target user', 'Optional; if supplied, will list reason for warning when checking user history.']
                ],
                admin: true
            },
            'rm_info': {
                str: 'Provides user history of warnings, kicks, bans and ban reverts.',
                args: [
                    ['@user'],
                    ['Ping of the target user']
                ],
                admin: true
            }
        }
    },
    music: {
        header: '### Music Commands ###',
        commands: {
            'join': {
                str: 'Puts the bot into your active voice chat. You must be connected to a voice chat to work.',
            },
            'play': {
                str: 'Plays the YouTube URL audio in the active voice chat.',
                args: [
                    ['url'],
                    ['YouTube URL for a given video/song.']
                ]
            },
            'leave': {
                str: 'Kicks the bot out of its active voice chat.'
            },
            'skip': {
                str: 'Skips the current song, plays next if another available in queue.',
            },
            'stop': {
                str: 'Clears the music queue and disconnects the bot from the voice channel.',
            },
            'queue': {
                str: 'Lists the current music queue.',
                alts: ['q'],
            }
        }
    },
    playlist: {
        header: '### Playlist Commands ###\nUsage: playlist {subcommand} OR pl {subcommand}',
        commands: {
            'create': {
                str: 'Creates a playlist of the given name.',
                args: [
                    ['name'],
                    ['Playlist name (will become JSON file name).']
                ],
            },
            'add {name} {url}': {
                str: 'Adds URL to the playlist of the given name.',
                args: [
                    ['name url'],
                    ['Playlist name; YouTube URL for a given video/song.']
                ]
            },
            'list': {
                str: '...',
                args: [
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
                str: 'Removes the song at given index from the named playlist.',
                args: [
                    ['name index'],
                    ['Playlist name; Song index (found using list command)']
                ]
            },
            'play': {
                str: 'Adds all songs in the named playlist to the music queue.',
                args: [
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
                str: 'Displays your gaming statistics. If none found, generates a user profile.'
            },
            'inv': {
                str: 'Displays your inventory amounts.'
            },
            'sell': {
                str: 'Sells all items in your inventory.'
            }
        },
        subcommands: {
            'fishing': {
                header: '### Fishing Minigame Commands ###',
                commands: {
                    'cast': {
                        str: 'Casts your fishing rod. Will return a result within a couple seconds.'
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
                        str: 'Standard game of blackjack. Dealer rests at soft 17. 2x payout.',
                        args: [
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
                str: 'Drops an f in the chat.'
            },
            'fuck': {
                str: 'Rage comic fuuuuu!'
            },
            'yey': {
                str: 'Rage comic yey!'
            },
            'crabrave': {
                str: 'Starts playing Crabrave by Noisestorm in the voice chat.',
                alts: ['cr'],
            },
            'furry': {
                str: 'Drops an uwu in the voice chat. ;)'
            },
            'earrape': {
                str: 'Protect your ears.'
            },
            'turtlesex': {
                str: 'Added just because I could.'
            }
        }
    }
};