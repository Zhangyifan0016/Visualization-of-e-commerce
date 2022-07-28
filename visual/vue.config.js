const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  // 服务器进行配置
  devServer: {
    port: 8999,
    https: false,
    open: true
  },
  // 打包时不会生成 .map 文件，加快打包速度
  productionSourceMap: false
})
