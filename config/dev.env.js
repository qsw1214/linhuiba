var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

// 本地环境 api 配置 改动需重新运行
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API : '"http://api.lanhanba.net"'
  // BASE_API: '"http://192.168.0.196"'
})
