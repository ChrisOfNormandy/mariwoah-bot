module.exports = function(member, staffMember, servername, data, args = {}) {
    // console.log(data);
    let latest = data[data.length - 1];
    member.send(`This is an automated message. Replying doesn't do anything.\n\n` +
    `> You have been issued a ${latest.type} by ${staffMember.user.username} in the guild ${servername}.\n` +
    `> Reason: ${latest.reason}\n` +
    `> You currently have ${data.length} ${latest.type}s.\n> \n` +
    `> *Timestamp / ticket id: ${latest.ticket_id}.*`);
    if (args.duration)
        member.send(`> Punishment duration: ${args.duration} days.`);
}