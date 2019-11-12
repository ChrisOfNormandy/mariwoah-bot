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
        header: '### Playlist Commands ###\nUsage: playlist {subcommand} OR p {subcommand}',
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
                str: 'Displays your inventory amounts.',
                flags: [
                    ['f', 'g', 'm'],
                    [
                        'Displays all items in fishing inventory.',
                        'Displays all items in global items inventory.',
                        'Displays all items in mining inventory.'
                    ]
                ]
            },
            'sell': {
                str: 'Sells the inventory of the provided name.',
                args: [
                    ['fish', 'items', 'ores'],
                    [
                        'Sells all fish in the fishing inventory.',
                        'Sells all items in the global items inventory.',
                        'Sells all ores in the mining items inventory.'
                    ]
                ]
            },
            'teststats': {
                str: 'Determines the active status of all imported functions.'
            },
            'resetuser': {
                str: 'Resets your user profile. Use only in case of corruption or to zero-out all stats.'
            }
        },
        games: {
            'fishing': {
                header: '### Fishing Minigame Commands ###',
                commands: {
                    'cast': {
                        str: 'Casts your fishing rod. Will return a result within a couple seconds.'
                    },
                    'fishlist': {
                        str: 'Refreshes available fish and items to catch; Displays available catchables.'
                    },
                    'fishfact': {
                        str: 'Displays information about the fish of the given name.',
                        args: [
                            ['fish_name'],
                            ['Name of a fish; replace spaces with underscores when providing names.']
                        ]
                    },
                    'tolevel': {
                        str: 'Returns how many catches are required to progress to the next level.',
                        args: [
                            ['level'],
                            ['Should be a whole number; returns amount (total) to NEXT level. Input of 0 would return requirement for getting level 1.']
                        ]
                    },
                    'breakmyrod': {
                        'str': 'Snaps your fishing rod over your knee, setting durability to 0. Good for resetting a bugged rod.'
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
            }
        }
    }
};