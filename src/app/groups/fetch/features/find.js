const { duckIt } = require('node-duckduckgo');
const { Output, handlers } = require('@chrisofnormandy/mariwoah-bot');
const { embed } = require('@chrisofnormandy/mariwoah-bot').handlers;

const { MessageEmbed, createField } = embed;

/**
 * 
 * @param {MessageData} data 
 * @returns {Promise<Output>}
 */
module.exports = (data) => {
    let query = data.arguments[0];

    let searchType = 'ddg';

    if (/\\.+/.test(query) || data.flags.has('d'))
        searchType = 'direct';

    if (data.flags.has('d'))
        query = `\\${query}`;

    if (/!bing\s.+/.test(query) || data.flags.has('b'))
        searchType = 'bing';

    if (data.flags.has('b'))
        query = `!bing ${query}`;

    return new Promise((resolve, reject) => {
        duckIt(query, { noHtml: true, parentalFilter: 'Moderate' })
            .then((response) => {
                const res = response.data;

                const embed = new MessageEmbed()
                    .setTitle(`Search results for ${query}`)
                    .setColor(handlers.chat.colors.byName.aqua);

                switch (searchType) {
                    case 'direct': {
                        if (response.headers.link) {
                            const link = response.headers.link.split(';')[0].match(/<([^>]+)>/)[1];
                            embed.setURL(link);
                            embed.addField(createField(`From ${response.request.host}`, link));
                        }
                        else {
                            const url = response.request.res.responseUrl;
                            embed.setURL(url);
                            embed.addField(createField(`From ${response.request.host}`, url));
                        }
                        break;
                    }
                    case 'bing': {
                        const url = response.request.res.responseUrl;
                        embed.setURL(url);
                        embed.addField(createField(`From ${response.request.host}`, url));

                        let rList = response.data.match(/(<cite>)([\w.:/<>]+)(<\/cite>)+?/g);
                        let str = '', i = 0;
                        rList.forEach((html) => {
                            const link = html.replace(/<\/?\w+>/g, '');

                            if (!/\.\.\./.test(link) && /https?:\/\//.test(link)) {
                                str += link;
                                if (i < rList.length - 1)
                                    str += '\n';
                                i++;
                            }
                        });

                        embed.addField(createField('Search Results', str));

                        break;
                    }
                    default: {
                        if (!!res.Abstract && !!res.AbstractSource)
                            embed.addField(createField(`From ${res.AbstractSource}`, res.Abstract));

                        if (res.AbstractURL)
                            embed.setURL(res.AbstractURL);

                        if (res.RelatedTopics) {
                            let inc = 0, max = 3;
                            const length = res.RelatedTopics.length;
                            let str = '';
                            let other = {};

                            for (let count = 0; count < length; count++) {
                                const topic = res.RelatedTopics[count];

                                if (!topic.FirstURL) {
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
                                embed.addField(createField('From DuckDuckGo - Related topics:', str));

                            if (other)
                                for (let i in other) {
                                    embed.addField(createField(`From DuckDuckGo - ${i}`, `${other[i].Text}\n${other[i].FirstURL}`));
                                }
                        }

                        break;
                    }
                }

                if (!embed.fields.length)
                    embed.addField(createField('Nothing found.', 'Try a different search term.'));

                resolve(new Output({ embeds: [embed.build()] }));
            })
            .catch((err) => reject(new Output().setError(err)));
    });
};
