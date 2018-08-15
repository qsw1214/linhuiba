/**
* 配置运行环境与线上环境的切换
* baseUrl 为域名地址
* routerMode 为路由模式
*/

let baseUrl = '' ;
let routerMode = 'hash' ; // 路由模式不可变  涉及支付相关

if (process.env.NODE_ENV == 'development') {
  // 本地开发环境
  baseUrl = process.env.BASE_API;
  // baseUrl = http://192.168.0.196
}
else if(process.env.NODE_ENV == 'production'){
  let host = window.location.host ;
  let reg = /lanhanba/gi ;
  if(reg.test(host)){
    // 测试环境
    baseUrl = process.env.TEST_BASE_API;
  }else{
    // 正式环境( 上线之前需要沟通下 )
    baseUrl =  process.env.BASE_API;
  }
}

export {
  baseUrl,
  routerMode
}
