/**
 * 返回年月日
 * @export
 * @param {Date} date
 * @param {string} [splitor='-']
 * @returns
 */
export function getDate(date, splitor = '-') {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}${splitor}${addZeroPrefix(month)}${splitor}${addZeroPrefix(day)}`
}

/**
 * 返回时分秒/时分
 * @export
 * @param {*} date
 * @param {boolean} [withSecond=false]
 * @returns
 */
export function getTime(date, withSecond = false) {
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return withSecond ? `${addZeroPrefix(hour)}:${addZeroPrefix(minute)}:${addZeroPrefix(second)}` : `${hour}:${addZeroPrefix(minute)}`
}

export function getFullDate(date) {
    return `${getDate(date)} ${getTime(date)}`
}

export function isToday(date) {
    return date.toDateString() === new Date().toDateString()
}

export function isYesterday(date) {
    const today = new Date().getFullYear() + new Date().getMonth() + new Date().getDate()
    const oldDay = date.getFullYear() + date.getMonth() + date.getDate()
    return today - oldDay === 1
}

export function isTishYear(date) {
    return date.getFullYear() === new Date().getFullYear()
}
/**
 * 个位数，加0前缀
 * @param {*} number
 * @returns
 */
function addZeroPrefix(number) {
    return number < 10 ? `0${number}` : number
}