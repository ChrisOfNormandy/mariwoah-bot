function timestampToDate(timestamp) {
    return new Date(timestamp);
}

// Gets the age of a message by comparing original (a) to current (b)
function getAge(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    const r = Math.floor((utc2 - utc1) / _MS_PER_DAY);

    return r;
}

function byTimestamp(old, current) {
    return getAge(timestampToDate(old), timestampToDate(current));
}

module.exports = {
    timestampToDate,
    byTimestamp
}