function array(message, member) {
    let array = [];
    member.roles.cache.forEach((v, k, m) => {
        array.push(v);
    });

    return array;
}

function admin(message, member) {
    return new Promise((resolve, reject) => {
        const regex = /Admin/g;
        let flag = false;
        let role = null;

        message.guild.roles.cache.forEach((v, k, m) => {
            if (regex.test(v.name))
                flag = true;
        });

        if (!flag) {
            resolve(message.guild.roles.create({
                data: {
                    name: roles.admin,
                    color: 'RED'
                }
            }));
        }
        else {
            member.roles.cache.forEach((v, k, m) => {
                if (regex.test(v.name))
                    role = v;
            });

            resolve(role);
        }
    });
}

module.exports = {
    array,
    admin
}