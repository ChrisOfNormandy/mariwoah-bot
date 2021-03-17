const ddg = require('node-duckduckgo').duckIt;
const Discord = require('discord.js');
const { chatFormat, output } = require('../../../helpers/commands');

module.exports = (message, data) => {
    const query = data.arguments[0];

    return new Promise((resolve, reject) => {
        ddg(query, { noHtml: true, parentalFilter: 'Moderate' })
            .then(response => {
                const res = response.data;
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Search results for ${query}`)
                    .setColor(chatFormat.colors.byName.aqua);
                
                console.log(res.Abstract, res.AbstractSource);
                console.log(res.AbstractURL);

                if (!!res.Abstract && !!res.AbstractSource)
                    embed.addField(`From ${res.AbstractSource}`, res.Abstract);
                if (!!res.AbstractURL)
                    embed.setURL(res.AbstractURL);

                if (!!res.RelatedTopics) {
                    console.log(res.RelatedTopics);
                    let inc = 0, max = 3;
                    const length = res.RelatedTopics.length;
                    let str = '';
                    let other = {};

                    for (let count = 0; count < length; count++) {
                        const topic = res.RelatedTopics[count];

                        if (!!!topic.FirstURL) {
                            console.log(topic.Topics);
                            other[topic.Name] = topic.Topics[0];
                            continue;
                        }

                        if (inc < max) {
                            str += `${topic.Text}\n${topic.FirstURL}`;
                            if (count < max && count < 4)
                                str += '\n\n';
                            count++;
                            inc++;
                        }
                    }
                    if (str !== '')
                        embed.addField('From DuckDuckGo - Related topics:', str);
                    if (!!other)
                        for (let i in other) {
                            embed.addField(`From DuckDuckGo - ${i}`, `${other[i].Text}\n${other[i].FirstURL}`);
                        }
                }

                resolve(output.valid([], [embed]));
            })
            .catch(err => reject(output.error([err], [err.message])));
    });
}
