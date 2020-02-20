module.exports = function (message) {
    const vc = message.member.voiceChannel;
    if (!vc)
        return undefined;
    return vc;
}