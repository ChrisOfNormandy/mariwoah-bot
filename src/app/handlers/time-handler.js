/**
 * 
 * @param {number} timestamp 
 * @returns 
 */
function timestampToDate(timestamp) {
    return new Date(timestamp);
}

// Gets the age of a message by comparing original (a) to current (b)
function age_days(a, b) {
    const ms = 1000 * 60 * 60 * 24;

    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours(), a.getMinutes(), b.getSeconds());

    return Math.floor((utc2 - utc1) / ms);
}

function age_hours(a, b) {
    const ms = 1000 * 60 * 60;

    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours(), a.getMinutes(), b.getSeconds());

    return Math.floor((utc2 - utc1) / ms) % 24;
}

function age_minutes(a, b) {
    const ms = 1000 * 60;

    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours(), a.getMinutes(), b.getSeconds());

    return Math.floor((utc2 - utc1) / ms) % 60;
}

function age_seconds(a, b) {
    const ms = 1000;

    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours(), a.getMinutes(), b.getSeconds());

    return Math.floor((utc2 - utc1) / ms) % 60;
}

function age_milliseconds(a, b) {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds(), a.getMilliseconds());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate(), b.getHours(), a.getMinutes(), b.getSeconds(), b.getMilliseconds());

    return Math.floor(utc2 - utc1) % 1000;
}

/**
 * 
 * @param {Date} old 
 * @param {Date} current 
 * @returns 
 */
function getTimestamp(old, current) {
    return {
        days: age_days(timestampToDate(old), timestampToDate(current)),
        hours: age_hours(timestampToDate(old), timestampToDate(current)),
        minutes: age_minutes(timestampToDate(old), timestampToDate(current)),
        seconds: age_seconds(timestampToDate(old), timestampToDate(current)),
        milliseconds: age_milliseconds(timestampToDate(old), timestampToDate(current))
    };
}

/**
 * 
 * @param {number} seconds 
 * @returns 
 */
function intToTimeString(seconds) {
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
        string: `${(hour > 0)
            ? hour + ':'
            : ''}${min}:${sec}`,
        timestamp: seconds
    };
}

module.exports = {
    timestampToDate,
    getTimestamp,
    intToTimeString
};