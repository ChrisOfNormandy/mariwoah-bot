module.exports = {
    main: {
        header: '### Help Commands ###\nUsage: ~help {subcommand} OR ~? {subcommand}\n_Allowed prefixes:_ . - ~',
        commands: {
            'basic': {
                str: 'General use commands.',
            },
            'music': {
                str: 'Music related commands.',
            },
            'playlist': {
                str: 'Playlist related commands.',
            },
            'minigames': {
                str: 'Minigames related commands. Try ~help minigames {game} for a specific minigame.'
            }
        }
    },
    basic: {
        header: '### Basic Commands ###',
        commands: {
            'ping': {
                str: 'Gets the Discord latency (delay between send and edit) and bot-to-server latency.',
            },
            'crabravelink': {
                str: 'Gets the YouTube URL for crab rave.',
            },
            'whoami': {
                str: 'Gets you.',
            },
            'fuck': {
                str: 'Rage comic fuuuuu... Good for when times are rough.',
            },
            'f': {
                str: 'Drops an F in chat.',
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
    }
};