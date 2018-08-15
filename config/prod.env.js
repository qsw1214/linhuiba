/**
 * 生产环境 api 配置 改动需重新打包
 */

module.exports = {
  NODE_ENV: '"production"',
  // TEST_BASE_API : '"http://api.lanhanba.net"' , // 测试环境
  TEST_BASE_API : '"http://api.lanhanba.net"' , // 测试环境
  //TEST_BASE_API: '"http://192.168.0.196"',        // 测试环境
  BASE_API: '"https://api.linhuiba.com"'        // 线上环境
}
