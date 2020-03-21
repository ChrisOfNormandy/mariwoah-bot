function getDateString() {
    let date = new Date();
    let dmy = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    let time =
        `${(date.getHours() <= 12)
            ? (date.getHours == 0) ? 12 : date.getHours()
            : date.getHours() - 12
        }:${(date.getMinutes() < 10)
            ? `0${date.getMinutes()}`
            : date.getMinutes()
        }:${(date.getSeconds() < 10)
            ? `0${date.getSeconds()}`
            : date.getSeconds()
        }:${date.getMilliseconds()}`

    return `> ${dmy} | ${time} `;
}

module.exports = function (string) {
    let str = `${getDateString()} "${string}"`;
    console.log(str);
}