import Vue from 'vue'
import { AjaxPlugin } from 'vux' // 依赖axios，本质上是相同的,可参考axios文档
import { baseUrl } from 'src/config/env';
Vue.use( AjaxPlugin ) ;

export default (obj) => {
  if(baseUrl){
    Vue.http.defaults.baseURL = baseUrl ;
    // Vue.http.defaults.baseURL = 'http://hz.linhui.com';
    // Vue.http.defaults.baseURL = 'http://192.168.0.196';
  }
  Vue.http.defaults.headers.post['Content-Type'] = 'appliction/x-www-form-urlencoded';
  return new Promise( (resolve , reject ) => {
    Vue.http(obj).then( res => {
      if( res.data.code === 1 ){
        resolve( res.data ) ;
      } else if (res.data.code === -99) {
        if( res.data.msg === '你的账户信息已过期，请重新登录' ){
          window.location.href = window.location.origin + '/#/login'
        }else{
          reject( res.data ) ;
        }
      } else {
        reject( res.data ) ;
      }
    }).catch( err => {
      reject( err );
    })
  })
}
