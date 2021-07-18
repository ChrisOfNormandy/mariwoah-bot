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

function byTimestamp(old, current) {
    return {
        days: age_days(timestampToDate(old), timestampToDate(current)),
        hours: age_hours(timestampToDate(old), timestampToDate(current)),
        minutes: age_minutes(timestampToDate(old), timestampToDate(current)),
        seconds: age_seconds(timestampToDate(old), timestampToDate(current))
    };
}

module.exports = {
    timestampToDate,
    byTimestamp
};