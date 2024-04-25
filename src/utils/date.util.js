module.exports.addMinutes = function (date, minutes) {
    return new Date(date.getTime() + minutes * 60000)
}

module.exports.addHours = function (numOfHours, date = new Date()) {
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000)
    return date
}

module.exports.addTime = function (timeInterval, date = new Date()) {
    const { days = 0, hours = 0, minutes = 0, seconds = 0 } = timeInterval

    const totalMilliseconds =
        days * 24 * 60 * 60 * 1000 +
        hours * 60 * 60 * 1000 +
        minutes * 60 * 1000 +
        seconds * 1000

    date.setTime(date.getTime() + totalMilliseconds)
    return date
}

module.exports.convert = function (d) {
    return d.constructor === Date
        ? d
        : d.constructor === Array
        ? new Date(d[0], d[1], d[2])
        : d.constructor === Number
        ? new Date(d)
        : d.constructor === String
        ? new Date(d)
        : typeof d === 'object'
        ? new Date(d.year, d.month, d.date)
        : NaN
}
module.exports.compare = function (a, b) {
    return isFinite((a = this.convert(a).valueOf())) &&
        isFinite((b = this.convert(b).valueOf()))
        ? (a > b) - (a < b)
        : NaN
}

module.exports.inRange = function (d, start, end) {
    return isFinite((d = this.convert(d).valueOf())) &&
        isFinite((start = this.convert(start).valueOf())) &&
        isFinite((end = this.convert(end).valueOf()))
        ? start <= d && d <= end
        : NaN
}

module.exports.currentDateOnly = function () {
    var today = new Date()
    var year = today.getFullYear()
    var month = today.getMonth() + 1
    var day = today.getDate()
    return year + '-' + month + '-' + day
}

module.exports.generateIDbyDate = function () {
    var today = new Date()
    var year = today.getFullYear()
    var month = (today.getMonth() + 1).toString().padStart(2, '0')
    var day = today.getDate()
    return year + '' + month + '' + day
}

module.exports.getDateString = function (d) {
    const pad = (v) => {
        return v < 10 ? '0' + v : v
    }
    var d = new Date()
    let year = d.getFullYear()
    let month = pad(d.getMonth() + 1)
    let day = pad(d.getDate())
    let hour = pad(d.getHours())
    let min = pad(d.getMinutes())
    let sec = pad(d.getSeconds())
    return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec
}
