const ddg = require('node-duckduckgo').duckIt;
const Discord = require('discord.js');
const { chatFormat, output } = require('../../../helpers/commands');

module.exports = (message, data) => {
    let query = data.arguments[0];

    let searchType = 'ddg';

    if (/\\.+/.test(query) || data.flags.includes('d'))
        searchType = 'direct';
    if (data.flags.includes('d'))
        query = `\\${query}`;

    if (/\!bing\s.+/.test(query) || data.flags.includes('b'))
        searchType = 'bing';
    if (data.flags.includes('b'))
        query = `!bing ${query}`;

    return new Promise((resolve, reject) => {
        ddg(query, { noHtml: true, parentalFilter: 'Moderate' })
            .then(response => {
                const res = response.data;
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Search results for ${query}`)
                    .setColor(chatFormat.colors.byName.aqua);

                switch (searchType) {                    
                    case 'direct': {
                        if (!!response.headers.link) {
                            const link = response.headers.link.split(';')[0].match(/<([^>]+)>/)[1];
                            embed.setURL(link);
                            embed.addField(`From ${response.request.host}`, link);
                        }
                        else {
                            const url = response.request.res.responseUrl;
                            embed.setURL(url);
                            embed.addField(`From ${response.request.host}`, url);
                        }
                        break;
                    }
                    case 'bing': {
                        const url = response.request.res.responseUrl;
                        embed.setURL(url);
                        embed.addField(`From ${response.request.host}`, url);

                        let rList = response.data.match(/(<cite>)([\w.:/<>]+)(<\/cite>)+?/g);
                        let str = '', i = 0;
                        rList.forEach(html => {
                            const link = html.replace(/<\/?\w+>/g, '');

                            if (!/\.\.\./.test(link) && /https?:\/\//.test(link)) {
                                str += link;
                                if (i < rList.length - 1)
                                    str += '\n';
                                i++;
                            }
                        });

                        embed.addField('Search Results', str);
                        break;
                    }
                    default: {
                        if (!!res.Abstract && !!res.AbstractSource)
                            embed.addField(`From ${res.AbstractSource}`, res.Abstract);

                        if (!!res.AbstractURL)
                            embed.setURL(res.AbstractURL);

                        if (!!res.RelatedTopics) {
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

                        break;
                    }
                }

                if (!embed.fields.length)
                    embed.addField('Nothing found.', 'Try a different search term.');

                resolve(output.valid([], [embed]));
            })
            .catch(err => reject(output.error([err], [err.message])));
    });
}
