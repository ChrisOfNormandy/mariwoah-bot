const sql = require('../../../../sql/adapter');
const Discord = require('discord.js')

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

function get(message, data) {
    return new Promise((resolve, reject) => {
        sql.server.general.getMotd(message.guild.id)
            .then(motd => {
                let embed = JSON.parse(motd);
                if (!embed)
                    embed = defaultMotd(message);
                    
                if (data.parameters.boolean['json'])
                    resolve({
                        value: JSON.stringify(embed)
                    });
                else
                    resolve({
                        value: {
                            embed
                        }
                    });
            })
            .catch(e => reject(e));
    });
}

function set(message, json_string) {
    console.log(json_string);
    return new Promise((resolve, reject) => {

        let json;
        if (json_string == 'reset')
            json = null;
        else
            json = JSON.parse(json_string) || null;
        console.log(json);
        sql.server.general.setMotd(message.guild.id, json)
            .then(r => resolve({
                value: 'Changed server MOTD.'
            }))
            .catch(e => reject(e));
    });
}

module.exports = {
    get,
    set
}