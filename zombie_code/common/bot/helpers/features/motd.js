const commandFormat = require('../global/commandFormat');
// const sql = require('../../../../sql/adapter');

function defaultMotd(message) {
    return {
        title: `${message.guild.name} MOTD`,
        color: '#a81686',
        fields: [{
                name: "This is a field.",
                value: "You can set this value to whatever you want using the setmotd command.",
                inline: true
            },
            {
                name: "For information on how to set these values...",
                value: "click the link provided (Discord documentation).",
                inline: true
            }
        ],
        url: "https://discordjs.guide/popular-topics/embeds.html#using-an-embed-object"
    };
}

function get(message, parameters) {
    return new Promise((resolve, reject) => {
        sql.server.general.getMotd(message.guild.id)
            .then(motd => {
                let embed = JSON.parse(motd);
                if (!embed)
                    embed = defaultMotd(message);

                resolve(parameters.boolean['json']
                    ? motd
                        ? commandFormat.valid([motd], [motd])
                        : commandFormat.valid([motd], [JSON.stringify(embed)])
                    : commandFormat.valid([motd], [{embed}])
                );
            })
            .catch(e => reject(commandFormat.error([e], [])));
    });
}

function set(message, data) {
    return new Promise((resolve, reject) => {
        let json;
        if (json_string == 'reset')
            json = null;
        else
            json = JSON.parse(data.arguments.join(' ')) || null;

        sql.server.general.setMotd(message.guild.id, json)
            .then(r => resolve(commandFormat.valid([json], ['Changed server MOTD.'])))
            .catch(e => reject(commandFormat.error([e], [])));
    });
}

module.exports = {
    get,
    set
}