module.exports = function (message, client) {
    message.channel.send('You rang?')
        .then(msg => msg.edit(`> Some stats:\n> --- Message latency is ${msg.createdTimestamp - message.createdTimestamp}ms.\n> --- API latency is ${Math.round(client.ping)}ms.`))
        .catch(e => console.log(e));
    try {
        message.delete();
    }
    catch (e) {
        message.channel.send('I require admin permissions to operate correctly.');
    }
}