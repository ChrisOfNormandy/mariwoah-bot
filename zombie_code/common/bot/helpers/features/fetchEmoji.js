const commandFormat = require('../global/commandFormat');

function fetch(message, data) {
    let arr = [];
    const emoji_name = data.arguments[0];

    data.client.guilds.cache.forEach((guild, id, map) => {
        guild.emojis.cache.forEach((emoji, id, map) => {
            if (emoji.name == emoji_name)
                arr.push(`<:${emoji.name}:${id}>`);
        });
    });

    return commandFormat.valid([arr], [arr]);
}

module.exports = fetch;