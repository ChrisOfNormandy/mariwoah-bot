# Mariwoah Bot - The NPM Module

What's included in this module:
- A prebuilt client with a message handler.
- A command parser with mention, url and flag support.
- An easy-to-use command generator and subcommand handler.
- Command grouping.

And what's supported by the bot:
- Natively supports Regular Expressions (RegExp) for commands, arguments.
- Asynchronous handling - all commands are handled using Promises.
    - When creating new commands, ensure their return type is `Promise<Output>`.
- Two filter types - chat and name.
    - Chat filter: scans messages sent by users and automatically warns, kicks or bans users based on the filter violation.
    - Name filter: scans new member usernames, current usernames and nicknames and automatically warns, kicks or bans users based on the filter violation.
    - Both can be enabled / disabled in the config settings.
- Detailed command output handling.
- Detailed error handling with multiple kinds of logging.

Install using
> npm install @chrisofnormandy/mariwoah-bot

# Setup
The following is a step-by-step process for setting up a basic "starter bot."

If you're not new to Node projects, skip steps 1 and 2.

1. Within the directory your bot will be hosted, open a terminal.
2. Run the following commands - this will initialize a Node project.
    - `npm init`
    - Alternatively, create a `package.json` file (example provided in `Examples.md`).

3. Create the following in the directory your bot will be hosted from:
    - `./config/` - A folder named `config`.
    - `./config/config.json` - A file named `config.json`.
    - `./bot.js` - The entry point for your bot application. Alternatively `index.js` or whatever you would like to name it.

4. Copy the example data from `Examples.md` to the respective new files.
5. Set up the bot using the following in `bot.js`:
```js
const { client } = require('@chrisofnormandy/mariwoah-bot');
const config = require('./config/config.json');

client.startup(config);
```

or in one line:
```js
require('@chrisofnormandy/mariwoah-bot').client
    .startup(require('./config/config.json'));
```

> `#startup(clientConfig: object, devEnabled?: boolean): Discord.Client`

## How to Add Commands
Setting up a command is done via the `Command` class.
Here is an example command that finds YouTube information of a video given its title or URL:
```js
const songInfo = new Command(
    'music',
    (message, data) => groups.music.song.info(message, data)
)
    .setRegex(
        /(song\?)|(songinfo)/,
        /\s(([\w\s]+)|((<URL:\d+>(,\s?)?)+))/,
        [2, 3]
    )
    .setCommandDescription('Gathers information about one or more videos.')
    .setArgumentDescription(
        0,
        'Video(s)',
        'One or more YouTube URLs or the title of a video or playlist.'
    )
```
> `new Command(group?: string, func?: (arg0: Message, arg1: MessageData) => any): Command`
>
> `setRegex(command: RegExp, args?: RegExp, indexes?: number[], optional?: boolean): Command`
>
> `Command.setCommandDescription(desc: string): Command`
>
> `Command.setArgumentDescription(index: number, name: string, desc: string, optional?: boolean): Command`

The `Command` constructor does not require any provided arguments, as all values can be defined using setter methods.
The arguments that may be provided are:
- Command group name - used for grouping commands by "context" in the help listing. Default `undefined`.
- Function - the function executed when the command is called. Default `() => {}` (empty anonymous function).

`#setRegex` requires 1 argument - the command as a `RegExp`. Optional additional arguments:
- Arguments - `RegExp` defining command arguments.
- Indexes - `number[]`: An array of indexes used for matching the arguments to the appropriate value. Index 0 is always the initial input.

The example provided `.setRegex(/(song\?)|(songinfo)/, /\s(([\w\s]+)|((<URL:\d+>(,\s?)?)+))/, [2, 3])` translates to:
- Command accepts `song?` or `songinfo`.
- Arguments accepted: `Any set of alphanumeric characters and spaces` or `any URL` or `any list of comma-separated URLs`.
- From the `RegExp` match, use values in array index 2 and 3 - the video title or a list of 1+ URLs.

URL links are automatically parsed into a usable format for commands. They are represented as `<URL:#>` where # is the order it was listed. `<URL:0>` would be the first provided URL. They are stored as an array in `MessageData.urls`, accessable via `data` as an argument in the function.

The command description and argument description are optional and used for the help command.