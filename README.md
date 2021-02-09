# Dalie-PC-Web
## 项目说明
大猎英才猎头端（PC端）
## 技术栈
- vue-cli@4.0.5
- vue@2.6.10
- vuex@3.0.1
- vue-router@3.1.3
- axios@0.18.0
- element-ui@2.4.5
- sass@1.3.0
- stylus@0.54.7
- eslint@5.16.0

## 开发工具
建议使用vscode编辑器，配合使用eslint进行代码规范
## 项目结构 ##
```

|-- dist                             // 打包后的静态资源文件
|-- public                           // 入口文件
|   |-- debug                        // 腾讯云IM debug文件
|   |-- static                       // 资源文件
|   |-- favicon.ico                  // favicon.ico
|   |-- index.html                   // 入口html文件
|-- src                              // 源码目录
|   |-- api                          // 各模块的api接口
|       |-- demo                     // demo模块的所有api接口
|            |-- index.js            
|   |-- assets                       // images,sass相关资源文件
|       |-- images                   // 各模块的images文件
|            |-- demo                // demo模块的images文件
|       |-- sass                     // 各模块的sass文件
|            |-- demo                // demo模块的样式文件
|                 |-- index.scss    
|            |-- main.scss           // 全局公共样式
|   |-- components                   // 各模块的组件
|       |-- demo                     // demo模块的公共组件
|       |-- layout                   // 公共布局组件
|            |-- footerCommon.vue    // 公共底部
|            |-- headerCommon.vue    // 公共头部
|   |-- mixins                       // 混入函数
|   |-- plugins                      // 需全局引入的库、框架、过滤器
|       |-- element.js               // element-ui
|       |-- filter.js                // 过滤器
|       |-- index.js                 // 入口
|       |-- mixins.js                // 混入
|       |-- storage.js               // storage
|       |-- tim.js                   // 集成腾讯云IM
|   |-- router                       // 路由
|   |-- store                        // vuex
|       |-- modules                  // 各模块的数据状态管理
|            |-- dalie               // 大猎英才猎头端的modules
|                 |-- demo.js             // demo模块的数据状态管理
|            |-- tim                 // d腾讯云IM的modules
|       |-- index.js                 
|   |-- TIM                          // 腾讯云IM
|   |-- utils                        // 封装的工具类函数
|       |-- common.js                // 常用的一些方法
|       |-- filter.js                // 常用的一些过滤器
|       |-- http.js                  // 请求库封装
|       |-- storage.js               // localStorage，sessionStorage封装
|   |-- views                        // 各模块的pages
|       |-- demo                     // demo模块相关pages
|            |-- children            // 如果需要子路由，则新建children目录
|            |-- index.vue           // 主页面
|   |-- App.vue                      // 页面主入口
|   |-- main.ts                      // 脚本主入口
|-- .eslintignore                    // eslint忽略文件
|-- .eslintrc.js                     // eslint代码编写规格
|-- .gitignore                       // git忽略文件
|-- babel.config.js                  // babel配置文件
|-- package-lock.json                // 锁定安装依赖文件
|-- package.json                     // 项目及工具的依赖配置文件
|-- README.md                        // README
|-- vue.config.js                    // 项目开发配置，以及项目构建配置

```
## 项目运行
```
建议使用淘宝镜像
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm install
```

```
npm run serve
```

### 项目打包
```
npm run build
```

### 项目部署

##### jenkins

### 域名相关
##### 测试域名：暂无
##### 正式域名：暂无

### 分支说明
##### master：生产分支
##### test：测试分支
##### dev：开发分支

### 注意
尽量少的引入第三方库，npm install时注意区分dependencies和devDependencies


