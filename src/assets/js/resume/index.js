// 年龄
const age = [{
    value: '1',
    label: '<25岁'
}, {
    value: '2',
    label: '26-30岁'
}, {
    value: '3',
    label: '31-35岁'
}, {
    value: '4',
    label: '36-40岁'
}, {
    value: '5',
    label: '40岁以上'
}]

// 学历
const degree = [{
    value: '91',
    label: '其他'
}, {
    value: '92',
    label: '高中'
}, {
    value: '93',
    label: '技校'
}, {
    value: '94',
    label: '中专'
}, {
    value: '95',
    label: '大专'
}, {
    value: '96',
    label: '本科'
}, {
    value: '97',
    label: '硕士'
}, {
    value: '98',
    label: '博士'
}, {
    value: '99',
    label: '博士后'
}, {
    value: '911',
    label: 'MBA'
}]

// 工作经验
const workExp = [{
    value: '1',
    label: '1-3年'
}, {
    value: '2',
    label: '3-5年'
}, {
    value: '3',
    label: '5-8年'
}, {
    value: '4',
    label: '8年以上'
}]

// 期望城市
const attentCity = [{
    value: '110100',
    label: '北京市'
}, {
    value: '310100',
    label: '上海市'
}, {
    value: '440100',
    label: '广州市'
}, {
    value: '440300',
    label: '深圳市'
}, {
    value: '330100',
    label: '杭州市'
}, {
    value: '510100',
    label: '成都市'
}, {
    value: '420100',
    label: '武汉市'
}, {
    value: '320100',
    label: '南京市'
}, {
    value: '610100',
    label: '西安市'
}]

// 目前年薪
const yearSalary = [{
    value: '1',
    label: '10万以下'
}, {
    value: '2',
    label: '10-30万'
}, {
    value: '3',
    label: '30-50万'
}, {
    value: '4',
    label: '50-80万'
}, {
    value: '5',
    label: '80-100万'
}, {
    value: '6',
    label: '100万'
}]

// 订单状态
const orderStatus = [{
        value: '11',
        label: '初筛（供应商）'
    },
    {
        value: '12',
        label: '不合格待审'
    },
    {
        value: '13',
        label: '待重推'
    },
    {
        value: '16',
        label: '筛选通过（供应商）'
    },
    {
        value: '17',
        label: '初筛（供淘汰（供应商筛选阶段）应商）'
    },
    {
        value: '21',
        label: '初筛（企业）'
    },
    {
        value: '22',
        label: '筛选通过（企业）'
    },
    {
        value: '23',
        label: '淘汰（企业筛选阶段）'
    },
    {
        value: '31',
        label: '待约面'
    },
    {
        value: '32',
        label: '待面试'
    },
    {
        value: '34',
        label: '已到面'
    },
    {
        value: '36',
        label: '面试通过'
    },
    {
        value: '37',
        label: '面试未通过'
    },
    {
        value: '38',
        label: '面试取消'
    },
    {
        value: '41',
        label: '待发offer'
    },
    {
        value: '42',
        label: '已发offer'
    },
    {
        value: '44',
        label: '淘汰（Offer阶段）'
    },
    {
        value: '51',
        label: '已到岗'
    },
    {
        value: '52',
        label: '淘汰（待入职阶段）'
    },
    {
        value: '61',
        label: '已过保'
    },
    {
        value: '62',
        label: '淘汰（录用阶段）'
    }
]

export default {
    age,
    degree,
    workExp,
    attentCity,
    yearSalary,
    orderStatus
}