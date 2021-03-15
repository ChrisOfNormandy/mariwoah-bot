module.exports = function (seconds) {
    let sec = seconds % 60;
    let min_ = (seconds - sec) / 60;
    let min = min_ % 60;
    let hour = (min_ - min) / 60;

    if (sec < 10)
        sec = `0${sec}`;
    if (min < 10 && hour > 0)
        min = `0${min}`;

    return {
        seconds: sec,
        minutes: min,
        hour: hour,
        string: `${(hour > 0) ? hour + ':' : ''}${min}:${sec}`,
        timestamp: seconds
    }
}