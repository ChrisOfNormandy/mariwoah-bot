module.exports = function(message) {
    return {
        "id": message.channel.guild.id,
        "motd": "Message of the day!&tWhat an amazing message!",
        "permissions": {
            "levels": {
                owner: 5,
                administrator: 4,
                moderator: 3,
                helper: 2,
                vip: 1,
                default: 0
            },
            "commands": {
                rejectMessage_default: "You don't have permission to use that command.",
                rejectMessage_vip: "You must be a VIP to use that command.",
                rejectMessage_helper: "You must be a helper to use that command.",
                rejectMessage_moderator: "You must be a moderator to use that command.",
                rejectMessage_administrator: "You must be an administrator to use that command.",
                rejectMessage_owner: "Only the server owner can use that command.",
            }
        },
        "users": {},
        "prefixes": '~.-',
    }
}