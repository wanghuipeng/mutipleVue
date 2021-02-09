import { formatDate, formatTime } from './common'

// 封装过滤器

// 通用字典过滤器
const filterCommonDict = (val, arr = []) => {
    if (Array.isArray(val)) { // 范围主键
        const result = [];
        val.forEach((valItem) => {
            const arrItem = arr.filter(item => {
                if (item.value == valItem) {
                    return item
                } else {
                    return false
                }
            });
            if (arrItem && arrItem[0] && arrItem[0].label) {
                result.push(arrItem[0].label)
            }
        });
        return result.join('~');
    } else if (val && typeof(val) === 'string' && val.indexOf(',') !== -1) { // 多主键
        const result = [];
        const valArr = val.split(',');
        valArr.forEach((valItem) => {
            const arrItem = arr.filter(item => {
                if (item.value == valItem) {
                    return item
                } else {
                    return false
                }
            });
            if (arrItem && arrItem[0] && arrItem[0].label) {
                result.push(arrItem[0].label)
            }
        });
        return result.join('、');
    } else { // 单主键
        const item = arr.filter(item => {
            if (item.value == val) {
                return item
            } else {
                return false
            }
        });
        return (item && item[0] && item[0].label) || val
    }
}

// 过滤二级
const filterLevel2 = (val, arr = []) => {
    let result = '';
    if (val) {
        val += '';
        arr.forEach(firstItem => {
            if (firstItem.value.substr(0, 2) == val.substr(0, 2)) {
                firstItem.children.forEach(secondItem => {
                    if (secondItem.value == val) {
                        result = secondItem.label
                    }
                });
            }
        });
    }
    return result
}

// 过滤二级(多个)
const filterLevels2 = (val, arr = []) => {
    const result = [];
    const valArr = val && val.split(',');
    valArr && valArr.forEach((valItem) => {
        const arrItem = arr.filter(item => {
            item.children && item.children.filter(item1 => {
                if (item1.value == valItem) {
                    result.push(item1.label)
                } else {
                    return false
                }
            })

        });
    });
    return result.join('、');
}

// 过滤三级
const filterLevel3 = (val, arr = []) => {
    let result = '';
    if (val) {
        val += '';
        arr.forEach(firstItem => {
            if (firstItem.value.substr(0, 2) == val.substr(0, 2)) {
                firstItem.children.forEach(secondItem => {
                    if (secondItem.value.substr(0, 4) == val.substr(0, 4)) {
                        secondItem.children.forEach(thirdItem => {
                            if (thirdItem.value == val) {
                                result = thirdItem.label
                            }
                        });
                    }
                });
            }
        });
    }
    return result
}

// 年月日
const filterDate = value => {
    var date = new Date(value)
    return formatDate(date, 'yyyy-MM-dd')
}

// 年月
const filterDateMonth = value => {
    var date = new Date(value)
    return formatDate(date, 'yyyy-MM')
}

// 年月日 时分秒
const filterDateTime = value => {
    var date = new Date(value)
    return value ? formatDate(date, 'yyyy-MM-dd hh:mm:ss') : ''
}

// 过滤字典
const filterArr = (val, arr) => {
    const item = val && arr && arr.filter(item => {
        if (item.value == val) {
            return item
        } else {
            return false
        }
    })
    return item && item[0] && item[0].label
}

// 过滤省市区
let cityArr = []
let districtArr = []

// 过滤省
const filterProvince = (val, address) => {
    const arrItem = address && address.filter(item => {
        if (item.value == val) {
            return item.label
        } else {
            return false
        }
    })
    cityArr = arrItem
    const province = Array.isArray(arrItem) && arrItem.length > 0 && arrItem[0].label
    return province || val
}

// 过滤市
const filterCity = (val) => {
    const arrItem =
        Array.isArray(cityArr) &&
        cityArr.length > 0 &&
        cityArr[0].children.filter(item => {
            if (item.value == val) {
                return item.label
            } else {
                return false
            }
        })
    districtArr = arrItem
    const city = Array.isArray(arrItem) && arrItem.length > 0 && arrItem[0].label
    return city || val
}

// 过滤操作人类型
const filterOperatorType = (val) => {
    switch (val) {
        case 1:
            return '猎头'
        case 2:
            return '后台'
    }
}

// 过滤年月为开始工作年份
const filterYear = (val) => {
    let result = '';
    if (val) {
        result = val.split('-')[0]
    }
    return result
}

// 过滤年月为实际工作年限
const filterYearMonth = (val, campareVal) => {
    let result = '';
    if (val) {
        const arr = val.split('-');
        const year = parseInt(arr[0]);
        const month = parseInt(arr[1]);
        const currDate = campareVal ? formatTime(new Date(campareVal)) : formatTime(new Date());
        const currYear = parseInt(currDate.year);
        const currMonth = parseInt(currDate.month);
        if ((year > currYear) || ((year === currYear) && (month >= currMonth))) {
            result = '无经验';
        } else if ((year === currYear) && (month < currMonth)) {
            result = (currMonth - month) + '个月';
        } else {
            if (month < currMonth) {
                result = (currYear - year) + '年' + (currMonth - month) + '个月';
            }
            if (month === currMonth) {
                result = (currYear - year) + '年';
            }
            if (month > currMonth) {
                result = (currYear - year - 1) + '年' + (12 - month + currMonth + 1) + '个月';
            }
        }
    }
    return result
}

// 过滤生日为实际年龄
const filterBirthday = (val) => {
    let result = '';
    if (val) {
        const arr = val.split('-');
        const year = parseInt(arr[0]);
        const month = parseInt(arr[1]);
        const currDate = formatTime(new Date());
        const currYear = parseInt(currDate.year);
        const currMonth = parseInt(currDate.month);
        if ((year > currYear) || ((year === currYear) && (month >= currMonth))) {
            result = '无';
        } else if ((year === currYear) && (month < currMonth)) {
            result = (currMonth - month) + '个月';
        } else {
            if (month < currMonth) {
                result = (currYear - year) + '岁';
            }
            if (month === currMonth) {
                result = (currYear - year) + '岁';
            }
            if (month > currMonth) {
                result = (currYear - year - 1) + '岁';
            }
        }
    }
    return result
}


// 今天，昨天，今年
const filterDates = (date) => {
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

// 年月日
const filterDatesHan = (date) => {
    const times = date.toString().replace(/-/g, '/')
    date = new Date(times)
    const today = new Date().getFullYear() + new Date().getMonth() + new Date().getDate()
    const oldDay = date.getFullYear() + date.getMonth() + date.getDate()
    return formatDate(date, 'yyyy年MM月dd日')
}

// 过滤手机号
const filterTel = (val) => {
    const reg = /(\d{3})\d{4}(\d{4})/;
    const result = val.replace(reg, "$1****$2")
    return result
}


// 数字转为汉字 
const filterChinaNum = (num) => {
    var arr1 = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九');  
    var arr2 = new Array('', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '万', '十', '百', '千', '亿'); //可继续追加更高位转换值
      
    if (!num || isNaN(num)) {     return "零";   }  
    var english = num.toString().split("")  
    var result = "";  
    for (var i = 0; i < english.length; i++) {    
        var des_i = english.length - 1 - i; //倒序排列设值
            
        result = arr2[i] + result;    
        var arr1_index = english[des_i];    
        result = arr1[arr1_index] + result;  
    }   //将【零千、零百】换成【零】 【十零】换成【十】
      
    result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十');   //合并中间多个零为一个零
      
    result = result.replace(/零+/g, '零');   //将【零亿】换成【亿】【零万】换成【万】
      
    result = result.replace(/零亿/g, '亿').replace(/零万/g, '万');   //将【亿万】换成【亿】
      
    result = result.replace(/亿万/g, '亿');   //移除末尾的零
      
    result = result.replace(/零+$/, '')   //将【零一十】换成【零十】
           //result = result.replace(/零一十/g, '零十');//貌似正规读法是零一十
           //将【一十】换成【十】
           result = result.replace(/^一十/g, '十');  
    return result;
}

export default {
    filterCommonDict,
    filterLevel2,
    filterLevels2,
    filterLevel3,
    filterDate,
    filterDateMonth,
    filterDateTime,
    filterArr,
    filterProvince,
    filterCity,
    filterOperatorType,
    filterYear,
    filterYearMonth,
    filterBirthday,
    filterDates,
    filterDatesHan,
    filterTel,
    filterChinaNum
}