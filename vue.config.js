// 参考文档地址：https://cli.vuejs.org/zh/config/
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin')

function resolve(dir) {
    return path.join(__dirname, dir)
}
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
console.log('当前环境', process.env.NODE_ENV)
module.exports = {
    pages: { // 配置多页面入口
        demo: {
            entry: 'src/demo/demo.main.js',
            template: 'public/demo.html'
        },
        index: {
            entry: 'src/main.js',
            template: 'public/index.html'
        }
    },
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
    outputDir: 'dist',
    assetsDir: '',
    indexPath: 'index.html',
    filenameHashing: true,
    lintOnSave: process.env.NODE_ENV !== 'production',
    runtimeCompiler: false,
    transpileDependencies: [],
    productionSourceMap: false,
    integrity: false,
    devServer: {
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