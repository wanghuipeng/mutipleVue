import Vue from 'vue'
import Router from 'vue-router'

// 登录模块
const login = r => require.ensure([], () => r(require('@/views/login')), 'login')
const forgetPassword = r => require.ensure([], () => r(require('@/views/login/forgetPassword')), 'forgetPassword.vue')
const register = r => require.ensure([], () => r(require('@/views/login/register')), 'register')
const completeInfo = r => require.ensure([], () => r(require('@/views/login/completeInfo')), 'completeInfo')
const guide1 = r => require.ensure([], () => r(require('@/views/login/guide1')), 'guide1')
const guide2 = r => require.ensure([], () => r(require('@/views/login/guide2')), 'guide2')
const protocol1 = r => require.ensure([], () => r(require('@/views/login/protocol1')), 'protocol1')
const protocol2 = r => require.ensure([], () => r(require('@/views/login/protocol2')), 'protocol2')
const upgrade = r => require.ensure([], () => r(require('@/views/login/upgrade')), 'upgrade')
const material = r => require.ensure([], () => r(require('@/views/login/material')), 'material')
const signup = r => require.ensure([], () => r(require('@/views/login/signup')), 'signup')
const capital = r => require.ensure([], () => r(require('@/views/login/capital')), 'capital')
const certification = r => require.ensure([], () => r(require('@/views/login/certification')), 'certification')
const certificationWait = r => require.ensure([], () => r(require('@/views/login/certificationWait')), 'certificationWait')
const certificationFail = r => require.ensure([], () => r(require('@/views/login/certificationFail')), 'certificationFail')

// 招聘会模块
const reserve = r => require.ensure([], () => r(require('@/views/jobfair/reserve')), 'reserve')

// 职位模块
const position = r => require.ensure([], () => r(require('@/views/position')), 'position')
const all = r => require.ensure([], () => r(require('@/views/position/rightMain/all')), 'all')
const hunter = r => require.ensure([], () => r(require('@/views/position/rightMain/hunter')), 'hunter')
const rpo = r => require.ensure([], () => r(require('@/views/position/rightMain/rpo')), 'rpo')
const subscription = r => require.ensure([], () => r(require('@/views/position/rightMain/subscription')), 'subscription')
const recommend = r => require.ensure([], () => r(require('@/views/position/rightMain/recommend')), 'recommend')
const follow = r => require.ensure([], () => r(require('@/views/position/rightMain/follow')), 'follow')
const monad = r => require.ensure([], () => r(require('@/views/position/rightMain/monad')), 'monad')
const record = r => require.ensure([], () => r(require('@/views/position/rightMain/record')), 'record')
const browse = r => require.ensure([], () => r(require('@/views/position/rightMain/browse')), 'browse')
const wholeStatistics = r => require.ensure([], () => r(require('@/views/position/rightMain/wholeStatistics')), 'wholeStatistics')
const positionDetail = r => require.ensure([], () => r(require('@/views/position/positionDetail')), 'positionDetail')
const companyDetail = r => require.ensure([], () => r(require('@/views/position/companyDetail')), 'companyDetail')
const deliverDetail = r => require.ensure([], () => r(require('@/views/position/deliverDetail')), 'deliverDetail')
const recommendResume = r => require.ensure([], () => r(require('@/views/position/recommendResume')), 'recommendResume')
const recommendPosition = r => require.ensure([], () => r(require('@/views/position/recommendPosition')), 'recommendPosition')
const recommendReport = r => require.ensure([], () => r(require('@/views/position/recommendReport')), 'recommendReport')
const reviewReport = r => require.ensure([], () => r(require('@/views/position/reviewReport')), 'reviewReport')
const sendSuccess = r => require.ensure([], () => r(require('@/views/position/sendSuccess')), 'sendSuccess')
const job = r => require.ensure([], () => r(require('@/views/position/job')), 'job')
const jobDetail = r => require.ensure([], () => r(require('@/views/position/jobDetail')), 'jobDetail')
const project = r => require.ensure([], () => r(require('@/views/position/project')), 'project')
const projectDetail = r => require.ensure([], () => r(require('@/views/position/projectDetail')), 'projectDetail')

// 消息模块
const notice = r => require.ensure([], () => r(require('@/views/notice')), 'notice')
const notFound = r => require.ensure([], () => r(require('@/views/notFound')), 'notFound')
    // 简历模块
const resume = r => require.ensure([], () => r(require('@/views/resume')), 'resume')
const resumeList = r => require.ensure([], () => r(require('@/views/resume/resumeList')), 'resumeList')
const resumeUpload = r => require.ensure([], () => r(require('@/views/resume/resumeUpload')), 'resumeUpload')
const resumeDetail = r => require.ensure([], () => r(require('@/components/resume/index/resumeDetail')), 'resumeDetail')
const talentReview = r => require.ensure([], () => r(require('@/components/resume/index/talentReview')), 'talentReview')
    // 个人中心模块
const myCenter = r => require.ensure([], () => r(require('@/views/myCenter')), 'myCenter')
const baseInfo = r => require.ensure([], () => r(require('@/views/myCenter/children/baseInfo')), 'baseInfo')
const skill = r => require.ensure([], () => r(require('@/views/myCenter/children/skill')), 'skill')
const editPassword = r => require.ensure([], () => r(require('@/views/myCenter/children/editPassword')), 'editPassword')
const attention = r => require.ensure([], () => r(require('@/views/myCenter/children/attention')), 'attention')
const earning = r => require.ensure([], () => r(require('@/views/myCenter/children/earning')), 'earning')
const identification = r => require.ensure([], () => r(require('@/views/myCenter/children/identification')), 'identification')
const invote = r => require.ensure([], () => r(require('@/views/myCenter/children/invote')), 'invote')
    // 订单模块
const order = r => require.ensure([], () => r(require('@/views/order/index')), 'order')
const allOrder = r => require.ensure([], () => r(require('@/views/order/rightMain/allOrder')), 'allOrder')
const recommendStage = r => require.ensure([], () => r(require('@/views/order/rightMain/recommendStage')), 'recommendStage')
const interviewStage = r => require.ensure([], () => r(require('@/views/order/rightMain/interviewStage')), 'interviewStage')
const entryStage = r => require.ensure([], () => r(require('@/views/order/rightMain/entryStage')), 'entryStage')
const offerStage = r => require.ensure([], () => r(require('@/views/order/rightMain/offerStage')), 'offerStage')
const overProtectionStage = r => require.ensure([], () => r(require('@/views/order/rightMain/overProtectionStage')), 'overProtectionStage')
const fail = r => require.ensure([], () => r(require('@/views/order/rightMain/fail')), 'fail')
const orderDetail = r => require.ensure([], () => r(require('@/views/order/detail/index')), 'orderDetail')
const candidateList = r => require.ensure([], () => r(require('@/views/order/candidate/company/list')), 'candidateList')

// 小程序扫码PC端跳转指定页面
const scan = r => require.ensure([], () => r(require('@/views/scan/index')), 'scan')
const srp = r => require.ensure([], () => r(require('@/views/scanRelease/index')), 'scanRelease')
    // 线索列表（直接访问）
const threadList = r => require.ensure([], () => r(require('@/views/thread/index')), 'threadList')
const sendResumeList = r => require.ensure([], () => r(require('@/views/thread/sendResumeList')), 'sendResumeList')
    // 统计
const statistics = r => require.ensure([], () => r(require('@/views/statistics/index')), 'statistics')
const tendency = r => require.ensure([], () => r(require('@/views/statistics/rightMain/tendency')), 'tendency')
const companyTendency = r => require.ensure([], () => r(require('@/views/statistics/rightMain/companyTendency')), 'companyTendency')
const companyDistribution = r => require.ensure([], () => r(require('@/views/statistics/rightMain/companyDistribution')), 'companyDistribution')
const performanceTendency = r => require.ensure([], () => r(require('@/views/statistics/rightMain/performanceTendency')), 'performanceTendency')
const kpiTendency = r => require.ensure([], () => r(require('@/views/statistics/rightMain/kpiTendency')), 'kpiTendency')
const recommendTendency = r => require.ensure([], () => r(require('@/views/statistics/rightMain/recommendTendency')), 'recommendTendency')
    // 首页
const home = r => require.ensure([], () => r(require('@/views/home/index')), 'home')
    // 企业管理
const company = r => require.ensure([], () => r(require('@/views/company/index')), 'company')
    // 发布职位
const releasePosition = r => require.ensure([], () => r(require('@/views/releasePosition/index')), 'releasePosition')

// 设置模块
const set = r => require.ensure([], () => r(require('@/views/set/index')), 'set')
const companyInfo = r => require.ensure([], () => r(require('@/views/set/rightMain/company')), 'companyInfo')
const department = r => require.ensure([], () => r(require('@/views/set/rightMain/department')), 'department')
const member = r => require.ensure([], () => r(require('@/views/set/rightMain/member')), 'member')
const protocol = r => require.ensure([], () => r(require('@/views/set/rightMain/protocol')), 'protocol')
const interfaceConfig = r => require.ensure([], () => r(require('@/views/set/rightMain/interfaceConfig')), 'interfaceConfig')
const talentPoolManagement = r => require.ensure([], () => r(require('@/views/set/rightMain/talentPoolManagement')), 'talentPoolManagement')
const talentPoolLabel = r => require.ensure([], () => r(require('@/views/set/rightMain/talentPoolLabel')), 'talentPoolLabel')

// 微门户模块
const miniPortal = r => require.ensure([], () => r(require('@/views/miniPortal/index')), 'miniPortal') // 微门户
const officialAccounts = r => require.ensure([], () => r(require('@/views/miniPortal/rightMain/officialAccounts')), 'officialAccounts') // 嵌入公众号
const personality = r => require.ensure([], () => r(require('@/views/miniPortal/rightMain/personality')), 'personality') // 个性化首页
const enterpriseStory = r => require.ensure([], () => r(require('@/views/miniPortal/rightMain/enterpriseStory')), 'enterpriseStory') // 企业故事
const recruitmentZone = r => require.ensure([], () => r(require('@/views/miniPortal/rightMain/recruitmentZone')), 'recruitmentZone') // 招聘专区
const recruitmentDetail = r => require.ensure([], () => r(require('@/views/miniPortal/rightMain/recruitmentDetail')), 'recruitmentDetail') // 招聘详情

// 面试间
const interviewRoom = r => require.ensure([], () => r(require('@/views/interviewRoom/index')), 'interviewRoom')

// 免密登录中转页
const middlePage = r => require.ensure([], () => r(require('@/views/middlePage/index')), 'middlePage')

// 供应商费率管理
const supplierRate = r => require.ensure([], () => r(require('@/views/set/rightMain/supplierRate')), 'supplierRate')
    // RPO业务配置
const rpoList = r => require.ensure([], () => r(require('@/views/set/rightMain/rpoList')), 'rpoList')

// Promoters（终端促销共享用户平台）---客户管理
const customer = r => require.ensure([], () => r(require('@/views/customer/index')), 'customer') // 客户管理
const promoterProject = r => require.ensure([], () => r(require('@/views/promoter/project/index')), 'promoterProject') // 项目管理
const promoterProjectDetail = r => require.ensure([], () => r(require('@/views/promoter/project/detail')), 'promoterProjectDetail') // 项目详情
const promoterPromotion = r => require.ensure([], () => r(require('@/views/promoter/promotion/index')), 'promoterPromotion') // 促销员管理

Vue.use(Router)

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};

export default new Router({
    scrollBehavior: (to, from, savedPosition) => ({
        if (savedPosition) {
            setTimeout(() => {
                window.scrollTo(savedPosition.x, savedPosition.y)
            }, 200)
        }
    }),
    mode: 'history',
    linkActiveClass: 'active',
    routes: [
        // 登录
        {
            path: '/login',
            name: 'login',
            component: login
        },
        // 找回密码
        {
            path: '/forgetPassword',
            name: 'forgetPassword',
            component: forgetPassword
        },
        // 注册
        {
            path: '/register',
            name: 'register',
            component: register
        },
        // 完整信息
        {
            path: '/completeInfo',
            name: 'completeInfo',
            component: completeInfo
        },
        // 新手引导第一步
        {
            path: '/guide1',
            name: 'guide1',
            component: guide1
        },
        // 新手引导第二步
        {
            path: '/guide2',
            name: 'guide2',
            component: guide2
        },
        // 用户协议
        {
            path: '/protocol1',
            name: 'protocol1',
            component: protocol1
        },
        // 用户协议
        {
            path: '/protocol2',
            name: 'protocol2',
            component: protocol2
        },
        // 企业注册
        {
            path: '/upgrade',
            name: 'upgrade',
            component: upgrade
        },
        // 企业资料
        {
            path: '/material',
            name: 'material',
            component: material
        },
        // 供应商注册
        {
            path: '/signup',
            name: 'signup',
            component: signup
        },
        // 供应商资料
        {
            path: '/capital',
            name: 'capital',
            component: capital
        },
        // 认证
        {
            path: '/certification',
            name: 'certification',
            component: certification
        },
        // 认证中
        {
            path: '/certificationWait',
            name: 'certificationWait',
            component: certificationWait
        },
        // 认证失败
        {
            path: '/certificationFail',
            name: 'certificationFail',
            component: certificationFail
        },
        // 招聘会封面
        {
            path: '/reserve',
            name: 'reserve',
            component: reserve
        },
        // 职位
        {
            path: '/position',
            name: 'position',
            component: position,
            children: [{ // 全部需求
                path: 'all',
                name: 'all',
                component: all
            }, { // 猎头职位
                path: 'hunter',
                name: 'hunter',
                component: hunter
            }, { // rpo职位
                path: 'rpo',
                name: 'rpo',
                component: rpo
            }, { // 订阅
                path: 'subscription',
                name: 'subscription',
                component: subscription
            }, { // 智能推荐
                path: 'recommend',
                name: 'recommend',
                component: recommend
            }, { // 我的关注
                path: 'follow',
                name: 'follow',
                component: follow
            }, { // 我的接单
                path: 'monad',
                name: 'monad',
                component: monad
            }, { // 职位动态
                path: 'record',
                name: 'record',
                component: record
            }, { // 最近浏览
                path: 'browse',
                name: 'browse',
                component: browse
            }, { // 全局统计
                path: 'wholeStatistics',
                name: 'wholeStatistics',
                component: wholeStatistics
            }]
        },
        // 职位详情
        {
            path: '/positionDetail',
            name: 'positionDetail',
            component: positionDetail
        },
        // 企业详情
        {
            path: '/companyDetail',
            name: 'companyDetail',
            component: companyDetail
        },
        // 交付顾问详情
        {
            path: '/deliverDetail',
            name: 'deliverDetail',
            component: deliverDetail
        },
        // 推荐候选人
        {
            path: '/recommendResume',
            name: 'recommendResume',
            component: recommendResume
        },
        // 推荐职位
        {
            path: '/recommendPosition',
            name: 'recommendPosition',
            component: recommendPosition
        },
        // 推荐报告
        {
            path: '/recommendReport',
            name: 'recommendReport',
            component: recommendReport
        },
        // 预览报告
        {
            path: '/reviewReport',
            name: 'reviewReport',
            component: reviewReport
        },
        // 发送成功
        {
            path: '/sendSuccess',
            name: 'sendSuccess',
            component: sendSuccess
        },
        // 职位
        {
            path: '/job',
            name: 'job',
            component: job,
        },
        // 职位详情
        {
            path: '/jobDetail',
            name: 'jobDetail',
            component: jobDetail,
        },
        // 项目
        {
            path: '/project',
            name: 'project',
            component: project,
        },
        // 项目详情
        {
            path: '/projectDetail',
            name: 'projectDetail',
            component: projectDetail,
        },

        // 默认首页
        {
            path: '/',
            name: 'index'
                // redirect: '/home'
        },
        // 消息
        {
            path: '/notice',
            name: 'notice',
            component: notice
        },
        // 订单
        {
            path: '/order',
            name: 'order',
            component: order,
            children: [{
                path: 'allOrder',
                name: 'allOrder',
                component: allOrder
            }, {
                path: 'recommendStage',
                name: 'recommendStage',
                component: recommendStage
            }, {
                path: 'interviewStage',
                name: 'interviewStage',
                component: interviewStage
            }, {
                path: 'entryStage',
                name: 'entryStage',
                component: entryStage
            }, {
                path: 'offerStage',
                name: 'offerStage',
                component: offerStage
            }, {
                path: 'overProtectionStage',
                name: 'overProtectionStage',
                component: overProtectionStage
            }, {
                path: 'fail',
                name: 'fail',
                component: fail
            }]
        },
        // 订单详情
        {
            path: '/orderDetail',
            name: 'orderDetail',
            component: orderDetail
        },
        {
            path: '/candidateList',
            name: 'candidateList',
            component: candidateList
        },
        // 简历
        {
            path: '/resume',
            name: 'resume',
            component: resume,
            meta: {
                title: '人才库-大猎英才',
            }
        },
        // 简历列表
        {
            path: '/resumeList',
            name: 'resumeList',
            component: resumeList,
            meta: {
                title: '新的线索-大猎英才',
            }
        },
        // 简历详情
        {
            path: '/resumeDetail',
            name: 'resumeDetail',
            component: resumeDetail
        },
        // 人才盘点
        {
            path: '/talentReview',
            name: 'talentReview',
            component: talentReview
        },
        // 上传简历
        {
            path: '/resumeUpload',
            name: 'resumeUpload',
            component: resumeUpload,
            meta: {
                title: '简历解析对比-大猎英才',
            }
        },
        // 我的主页
        {
            path: '/myCenter',
            component: myCenter,
            children: [{ // 个人资料
                path: 'baseInfo',
                name: 'baseInfo',
                component: baseInfo,
                meta: {
                    keepAlive: true,
                    title: '个人资料-大猎英才',
                }
            }, { // 擅长方向
                path: 'skill',
                name: 'skill',
                component: skill,
                meta: {
                    keepAlive: true,
                    title: '擅长方向-大猎英才',
                }
            }, { // 修改密码
                path: 'editPassword',
                name: 'editPassword',
                component: editPassword,
                meta: {
                    title: '账号设置-大猎英才',
                }
            }, { // 我的关注
                path: 'attention',
                name: 'attention',
                component: attention,
                meta: {
                    title: '关注动态-大猎英才',
                }
            }, { // 我的收入
                path: 'earning',
                name: 'earning',
                component: earning
            }, { // 实名认证
                path: 'identification',
                name: 'identification',
                component: identification,
                meta: {
                    keepAlive: true,
                    title: '实名认证-大猎英才',
                }
            }, { // 邀请好友
                path: 'invote',
                name: 'invote',
                component: invote,
                meta: {
                    title: '邀请好友-大猎英才',
                }
            }]
        },
        // 小程序扫码登录
        {
            path: '/scan',
            name: 'scan',
            component: scan
        },
        // 小程序扫码登录
        {
            path: '/srp',
            name: 'srp',
            component: srp
        },
        // 线索列表
        {
            path: '/threadList',
            name: 'threadList',
            component: threadList,
            meta: {
                title: '线索-大猎英才'
            }
        },
        // 简历投递
        {
            path: '/sendResumeList',
            name: 'sendResumeList',
            component: sendResumeList,
            meta: {
                title: '简历投递-大猎英才'
            }
        },
        // 统计
        {
            path: '/statistics',
            name: 'statistics',
            component: statistics,
            children: [{ // 个人线索趋势
                path: 'tendency',
                name: 'tendency',
                component: tendency
            }, { // 企业线索趋势
                path: 'companyTendency',
                name: 'companyTendency',
                component: companyTendency
            }, { // 企业线索分布
                path: 'companyDistribution',
                name: 'companyDistribution',
                component: companyDistribution
            }, { // 业务趋势统计
                path: 'performanceTendency',
                name: 'performanceTendency',
                component: performanceTendency
            }, { // 成员KPI统计
                path: 'kpiTendency',
                name: 'kpiTendency',
                component: kpiTendency
            }, { // 推荐转化分析
                path: 'recommendTendency',
                name: 'recommendTendency',
                component: recommendTendency
            }]
        },
        // 首页
        {
            path: '/home',
            name: 'home',
            component: home
        },
        // 企业管理
        {
            path: '/company',
            name: 'company',
            component: company
        },
        // 新增职位
        {
            path: '/releasePosition',
            name: 'releasePosition',
            component: releasePosition,
            meta: {
                title: '新增职位-大猎英才',
            }
        },
        // 设置
        {
            path: '/set',
            name: 'set',
            component: set,
            children: [{ // 企业信息
                    path: 'companyInfo',
                    name: 'companyInfo',
                    component: companyInfo
                }, { // 部门管理
                    path: 'department',
                    name: 'department',
                    component: department
                }, { // 成员管理
                    path: 'member',
                    name: 'member',
                    component: member
                }, { // 用户协议
                    path: 'protocol',
                    name: 'protocol',
                    component: protocol
                }, { // 接口配置
                    path: 'interfaceConfig',
                    name: 'interfaceConfig',
                    component: interfaceConfig
                }, { // 接口配置
                    path: 'talentPoolManagement',
                    name: 'talentPoolManagement',
                    component: talentPoolManagement
                }, { // 接口配置
                    path: 'talentPoolLabel',
                    name: 'talentPoolLabel',
                    component: talentPoolLabel
                },
                // 供应商费率管理
                {
                    path: 'supplierRate',
                    name: 'supplierRate',
                    component: supplierRate,
                    meta: {
                        title: '供应商费率管理-大猎英才'
                    }
                },
                // RPO业务配置
                {
                    path: 'rpoList',
                    name: 'rpoList',
                    component: rpoList,
                    meta: {
                        title: 'RPO业务配置-大猎英才'
                    }
                },
            ]
        },
        // 微门户
        {
            path: '/miniPortal',
            name: 'miniPortal',
            component: miniPortal,
            children: [{ // 嵌入公众号
                path: 'officialAccounts',
                name: 'officialAccounts',
                component: officialAccounts
            }, { // 个性化首页
                path: 'personality',
                name: 'personality',
                component: personality
            }, { // 个性化首页
                path: 'enterpriseStory',
                name: 'enterpriseStory',
                component: enterpriseStory
            }, { // 个性化首页
                path: 'recruitmentZone',
                name: 'recruitmentZone',
                component: recruitmentZone
            }, { // 个性化首页
                path: 'recruitmentDetail',
                name: 'recruitmentDetail',
                component: recruitmentDetail
            }]
        },
        // 面试间
        {
            path: '/interviewRoom',
            name: 'interviewRoom',
            component: interviewRoom,
            meta: {
                keepAlive: false,
                title: '面试间-大猎英才'
            }
        },
        // 免密登录中转页
        {
            path: '/middlePage',
            name: 'middlePage',
            component: middlePage,
            meta: {
                keepAlive: false,
                title: '大猎英才'
            }
        },
        // Promoters（终端促销共享用户平台）---客户管理
        {
            path: '/customer',
            name: 'customer',
            component: customer,
            meta: {
                keepAlive: false,
                title: '客户管理-大猎英才'
            }
        },
        {
            path: '/promoterProject',
            name: 'promoterProject',
            component: promoterProject,
            meta: {
                keepAlive: false,
                title: '项目管理-大猎英才'
            }
        },
        {
            path: '/promoterProjectDetail',
            name: 'promoterProjectDetail',
            component: promoterProjectDetail,
            meta: {
                keepAlive: false,
                title: '项目详情-大猎英才'
            }
        },
        {
            path: '/promoterPromotion',
            name: 'promoterPromotion',
            component: promoterPromotion,
            meta: {
                keepAlive: false,
                title: '促销员-大猎英才'
            }
        },
        // 404页面
        {
            path: '/notFound',
            name: 'notFound',
            component: notFound
        },
        {
            path: '*',
            redirect: '/notFound'
        }
    ]
})