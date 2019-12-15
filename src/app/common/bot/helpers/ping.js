module.exports = function(message, client) {
    message.channel.send('You rang?')
    .then(msg => msg.edit(`Some stats: Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API latency is ${Math.round(client.ping)}ms.`))
    .catch(e => console.log(e));
}