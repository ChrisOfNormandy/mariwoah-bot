module.exports = function (message) {
    let serverData = {
        "latestWarning": {
            "time": "",
            "reason": ""
        },
        "latestKick": {
            "time": "",
            "reason": ""
        },
        "latestBan": {
            "time": "",
            "reason": ""
        },
        "latestBanRevert": {
            "time": "",
            "reason": ""
        },

        "warnings": [],
        "kicks": [],
        "bans": [],
        "banReverts": [],

        "permissions": {
            "botAdmin": false,
            "botMod": false,
            "botHelper": false,
            "level": 0,
            "override": {}
        }
    }

    return serverData
}