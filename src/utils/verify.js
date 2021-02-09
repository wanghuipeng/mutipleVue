/**
 * 统一校验规则封装
 */

// 手机号码格式校验
const phoneFormat = (rule, value, callback) => {
    if (value) {
        const re = /^1[3456789]\d{9}$/;
        if (!re.test(value)) {
            callback(new Error('手机号码格式不正确'));
        } else {
            callback();
        }
    } else {
        callback();
    }
};

// 邮箱格式校验
const emailFormat = (rule, value, callback) => {
    if (value) {
        const re = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
        if (!re.test(value)) {
            callback(new Error('邮箱格式不正确'));
        } else {
            callback();
        }
    } else {
        callback();
    }
};

// 真实姓名格式校验
const trueNameFormat = (rule, value, callback) => {
    if (value) {
        const re = /^[\u0391-\uFFE5A-Za-z]/;
        if (!re.test(value)) {
            callback(new Error('支持中文、英文姓名'));
        } else {
            callback();
        }
    } else {
        callback(new Error('请输入真实姓名'));
    }
};

// 花名格式校验
const nickNameFormat = (rule, value, callback) => {
    if (value) {
        const re = /^[\u0391-\uFFE5a-zA-Z0-9_\\-]+$/;
        if (!re.test(value)) {
            callback(new Error('支持中英文、数字、中划线、下划线，不支持特殊字符'));
        } else if (value.length < 2 || value.length > 6) {
            callback(new Error('2-6个字符'));
        } else {
            callback();
        }
    } else {
        callback();
    }
};

// 问卷名称
const questionFormat = (rule, value, callback) => {
    if (value) {
        console.log(22222, value)

        const re = /^[\u0391-\uFFE5a-zA-Z0-9_\\-]+$/;
        if (!re.test(value)) {
            callback(new Error('支持中英文、数字、中划线、下划线，不支持特殊字符'));
        } else if (value.length < 2 || value.length > 16) {
            callback(new Error('2-16个字符'));
        } else {
            callback();
        }
    } else {
        callback();
    }
};

// 零或正整数格式校验
const numberFormat = (rule, value, callback) => {
    if (value && value !== '0') {
        const re = /^[0-9]*[1-9][0-9]*$/;
        if (!re.test(value)) {
            callback(new Error('请输入零或正整数'));
        } else {
            callback();
        }
    } else {
        callback();
    }
};

// 零或正整数格式校验
const ageFormat = (rule, value, callback) => {
    if (value) {
        const re = /(^[1-9]\d*$)/;
        if (!re.test(value)) {
            callback(new Error('请输入正确的年龄'));
        } else {
            callback();
        }
    } else {
        callback();
    }
};

// QQ格式校验
const numberFormatQQ = (rule, value, callback) => {
    if (value && value !== '0') {
        const re = /^[0-9]*[1-9][0-9]*$/;
        if (!re.test(value)) {
            callback(new Error('请输入正确的QQ号'));
        } else {
            callback();
        }
    } else {
        callback();
    }
};


// 密码格式校验
const passwordFormat = (rule, value, callback) => {
    if (value) {
        const re1 = /^[0-9]*[1-9][0-9]*$/;
        const re2 = /^[\u0391-\uFFE5A-Za-z]+$/;
        console.log(!re1.test(value), !re2.test(value))
        if (re1.test(value) || re2.test(value) || value.length <= 12) {
            callback();
        } else {
            callback(new Error('支持8-12位英文、数字组合，区分大小写'));

        }
    } else {
        callback();
    }
};

// 目前月薪格式校验
const salaryMonthFormat = (rule, value, callback) => {
    console.log(2222222, value)
    if (value) {
        const re = /^[0-9]*[1-9][0-9]*$/;
        if (!re.test(value) || (value - 0) <= 1000) {
            callback(new Error('请输入大于1000的正整数'));
        } else {
            callback();
        }
    } else {
        callback();
    }
};

// 身份证号码格式校验
const idNumFormat = (rule, value, callback) => {
    if (value) {
        const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        if (!reg.test(value)) {
            callback(new Error('请输入正确的身份证号码'));
        } else {
            callback();
        }
    } else {
        callback();
    }
}

export default {
    phoneFormat,
    emailFormat,
    trueNameFormat,
    nickNameFormat,
    questionFormat,
    numberFormat,
    ageFormat,
    numberFormatQQ,
    passwordFormat,
    salaryMonthFormat,
    idNumFormat
};