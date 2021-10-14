// 参考文档地址：https://cli.vuejs.org/zh/config/
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin')
const config = require('./src/config/pageConfig.js')
const projectName = process.env.PROJECT_NAME;

function resolve(dir) {
    return path.join(__dirname, dir)
}
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
console.log('当前环境', process.env.NODE_ENV)
module.exports = {
    pages: projectName ? { index: config[projectName] } : config, // 打包时需要自定义文件名 启动不需要
    // alias 配置
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('tim', resolve('src/TIM/src/tim.js'))
            // if (process.env.NODE_ENV !== 'production') {
            //     config
            //         .plugin('webpack-bundle-analyzer')
            //         .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
            // }
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            // 生产环境(开启gzip压缩)
            config.plugins.push(
                new CompressionWebpackPlugin({
                    filename: '[path].gz[query]', // 提示示compression-webpack-plugin@3.0.0的话asset改为filename
                    algorithm: 'gzip',
                    test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                    threshold: 10240,
                    minRatio: 0.8
                })
            );
            // 返回一个将会被合并的对象
            return {
                optimization: {
                    minimizer: [
                        new TerserPlugin({
                            sourceMap: false,
                            terserOptions: {
                                compress: {
                                    drop_console: true
                                }
                            }
                        })
                    ]
                }
            }
        } else {
            // 开发环境

        }
    },
    css: {
        loaderOptions: {
            stylus: {
                'resolve url': true,
                // 自定义主题场景
                import: [path.resolve(__dirname, './src/TIM/src/assets/css/base.styl')]
            }
        }
    },
    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
    outputDir: 'dist/' + projectName + '/', // 分开打包
    assetsDir: '',
    indexPath: 'index.html',
    filenameHashing: true,
    lintOnSave: process.env.NODE_ENV !== 'production',
    runtimeCompiler: false,
    transpileDependencies: [],
    productionSourceMap: false,
    integrity: false,
    devServer: {
        index: 'index.html', //  默认启动页面
        proxy: {
            '/api': {
                target: 'https://h.dalieyingcai.com', // prod
                // target: 'https://hh.dalie.zpstar.com', // test
                pathRewrite: {
                    '^/api': '/api'
                }
            }
        },
        // 显示警告和错误
        overlay: {
            warnings: true,
            errors: true
        },
        // 自动打开浏览器
        open: true
    }
}