module.exports = function (message) {
    const vc = message.member.voice.channel;
    if (!vc)
        return undefined;
    return vc;
}