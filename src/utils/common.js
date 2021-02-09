// 时间戳转化日期
export function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            const str = o[k] + ''
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
        }
    }
    return fmt
}

function padLeftZero(str) {
    return ('00' + str).substr(str.length)
}

// 格式化日期
export function formatTime(date) {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minute < 10) {
        minute = '0' + minute;
    }
    if (second < 10) {
        second = '0' + second;
    }
    return {
        year: year,
        month: month,
        day: day,
        ymd: year + '-' + month + '-' + day,
        completeDate: year +
            '-' +
            month +
            '-' +
            day +
            ' ' +
            hour +
            ':' +
            minute +
            ':' +
            second
    };
}

// 手机号验证
export function isvalidPhone(str) {
    const reg = /^1[3|4|5|6|7|8|9][0-9]\d{4,8}$/
    return reg.test(str)
}


// 银行卡号
export function isvalidBankNo(str) {
    const reg = /\d{15}|\d{19}/
    return reg.test(str)
}

// 数组对象去重
export function uniqueArr(arr) {
    if (!Array.isArray(arr)) {
        console.log('type error!')
        return
    }
    var array = [];
    for (var i = 0; i < arr.length; i++) {
        if (array.indexOf(arr[i]) === -1) {
            array.push(arr[i])
        }
    }
    return array;
}

// 删除数组中指定对象
export function removeArray(arr, obj) {
    var length = arr.length
    for (var i = 0; i < length; i++) {
        if (arr[i] === obj) {
            if (i === 0) {
                arr.shift() // 删除并返回数组的第一个元素
                return arr
            } else if (i === length - 1) {
                arr.pop() // 删除并返回数组的最后一个元素
                return arr
            } else {
                arr.splice(i, 1) // 删除下标为i的元素
                return arr
            }
        }
    }
}

// 删除数组中指定值
export function deleteArrItem(arr, i) {　　
    let index = arr.indexOf(i);
    arr.splice(index, 1)
}

/**
 *判断是否是数字
 *
 **/

export function isRealNum(val) {
    // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除，

    　　
    if (val === "" || val == null) {
        return false;　　
    }
    if (!isNaN(val)) {　　　　　　 //对于空数组和只有一个数值成员的数组或全是数字组成的字符串，isNaN返回false，例如：'123'、[]、[2]、['123'],isNaN返回false,
        //所以如果不需要val包含这些特殊情况，则这个判断改写为if(!isNaN(val) && typeof val === 'number' )
        　　　 return true;　　 }

    　
    else {　　　　 return false;　　 }
}


// 今天，昨天，今年
export function filterDates(date) {
    const times = date.toString().replace(/-/g, '/')
    date = new Date(times)
    const today = new Date().getFullYear() + new Date().getMonth() + new Date().getDate()
    const oldDay = date.getFullYear() + date.getMonth() + date.getDate()
    if (date.toDateString() === new Date().toDateString()) {
        return formatDate(date, 'hh:mm')
    } else if (today - oldDay === 1) {
        return '昨天'
    } else if (date.getFullYear() === new Date().getFullYear()) {
        return formatDate(date, 'MM-dd')
    } else {
        return formatDate(date, 'yyyy-MM-dd')
    }
}

// 判断浏览器
export function checkBrowser() {
    window.browser = {};
    //获取信息字符串
    var ua = navigator.userAgent.toLowerCase();
    //浏览器信息数组，浏览器名称+版本号
    //如果存在,firefox
    if ((/firefox\/([\d.]+)/).test(ua)) {
        return 'firefox'
    } //如果存在,chrome
    if ((/chrome\/([\d.]+)/).test(ua) && !(/qqbrowser\/([\d.]+)/).test(ua)) {
        return 'chrome'
    } //如果存在,QQ浏览器
    if ((/qqbrowser\/([\d.]+)/).test(ua)) {
        return 'qqbrowser'
    }
}