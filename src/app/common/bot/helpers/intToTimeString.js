module.exports = {
    seconds: function(seconds) {
        let sec = seconds % 60;
        let min_ = (seconds - sec) / 60;
        let min = min_ % 60;
        let hour = (min_ - min) / 60;
        return {
            seconds: sec,
            minutes: min,
            hour: hour
        }
    }
}