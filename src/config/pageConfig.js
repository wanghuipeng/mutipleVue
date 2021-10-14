 const config = {
     demo: {
         entry: './src/demo/demo.main.js',
         template: 'public/demo.html',
         filename: 'demo.html' // 修改打包后的html文件名
     },
     index: {
         entry: './src/main.js',
         template: 'public/index.html',
         filename: 'index.html' // 修改打包后的html文件名
     }
 }

 module.exports = config