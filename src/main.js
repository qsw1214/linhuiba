
import Vue from 'vue'  // Vue.js v2.3.4
import VueRouter from 'vue-router' // vue-router v2.6.0
import { routerMode } from './config/env'
import routes from './router/router'
import './config/rem'
import store from './store' // vuex v2.3.0
import FastClick from 'fastclick'
import VueLazyload from 'vue-lazyload' // Vue-Lazyload v1.0.5
import 'babel-polyfill'
import { AlertPlugin , ToastPlugin, LoadingPlugin, ConfirmPlugin, WechatPlugin } from 'vux' // toast , loading 以插件模式全局调用
import BaiduMap from 'vue-baidu-map'
import { getSession , setSession } from './config/tools'
import App from './App'
import 'animate.css'
import 'vue-fullpage/vue-fullpage.css'
import VueFullpage from 'vue-fullpage'
// click事件换成touch
if('addEventListener' in document){
  document.addEventListener('DOMContentLoaded' , function(){
    FastClick.attach(document.body);
  } , false);
}

Vue.config.productionTip = false ;// 设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.use( VueRouter ) ;
Vue.use(AlertPlugin);
Vue.use( ToastPlugin ) ;
Vue.use( LoadingPlugin );
Vue.use( ConfirmPlugin );
Vue.use(WechatPlugin);
Vue.use( BaiduMap , {
   ak : 'yc3n5fiQQVezzrpESqpE6BCM'
}) ;
Vue.use(VueFullpage) ;
Vue.use( VueLazyload , {
  proLoad : 1.2, // 预加载比例(超前加载)
  error: 'https://comment.linhuiba.com/Fia3BCjHyan2ZrniNODOaIV4XtZ3', // 图片加载失败时站位的图
  loading: 'https://comment.linhuiba.com/Fia3BCjHyan2ZrniNODOaIV4XtZ3' ,// 正在加载时的动画图
  attempt: 1 , // 尝试加载次数
  listenEvents : ['scroll','touchmove'] // 触发事件
});

const router = new VueRouter({
  routes,
  mode : routerMode
  // scrollBehavior (to, from, savedPosition) {
  //   if (savedPosition) {
  //     return savedPosition
  //   } else {
  //     if (from.meta.keepAlive) {
  //       // 保存前一个 缓存路由 的scrolltop;
  //       from.meta.savedPosition = document.body.scrollTop;
  //     }
  //     // 返回的时候回到刚保存的scrolltop;
  //     return { x: 0, y: to.meta.savedPosition ||0}
  //   }
  // }

}) ;

router.beforeEach((to , from , next) => {
  // 处理链接
  let search = window.location.search , 
  reg = /shareRedirect/g ,
   appreg = /singlemessage|timeline/g ;
  if( appreg.test(search) ){
    // 处理分享的链接 ☆☆☆
    let redirect = '' ;
    let r = window.location.hash ;
    // 处理场地和活动合并之后分享的问题
    if( r.indexOf('/activities/activitiesDetail/') > 0 ){
      r = r.replace(/activities/gi ,'fields') ;
      if( r.indexOf('?') > -1 ){
        r = r + '&res_type_id=3'
      }else{
        r = r + '?res_type_id=3'
      }
    }else if( r.indexOf('/activities') > 0 ){
      r = r.replace(/activities/gi ,'fields') ;
    }

    if(r.indexOf('?') > -1 ){
      redirect = window.location.origin + '/' + r + "&BackKey=1";
    }else{
      redirect = window.location.origin + '/' + r + "?BackKey=1";
    }
    // wap 重定向到 m
    let hrefPath = redirect ;
    let pathReg = /v31m/i ;
    if( pathReg.test(hrefPath) ){
      let ret = hrefPath.replace(pathReg , 'm');
      window.location.href = ret  ;
      return false ;
    }else{
      window.location.href = redirect ;
      return false ;
    }
  }
  if( reg.test(search) ){
    // 处理回调的链接 ☆☆☆☆
    function getQuery(name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
      let r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return null;
    }
    let redirect = getQuery('shareRedirect') ;
    let url = window.location.origin + '/#/'+ redirect ;
    window.location.href = url ;
    return false ;
  }

  // 处理app加载传入的权限信息
  if( to.query.key ){
    setSession('key' ,  to.query.key );
  }else{  next() }

  if( to.matched.some( record => record.meta.requiresAuth ) ){
    let login = getSession( 'login' ) ;
    if( !login ){
      next({
        path : '/login',
        query : { redirect : to.fullPath }
      })
    }else{ next() }
  }else{ next() }

});
// router.afterEach((to , from , next) => {
//   if( window.ga ) {
//     window.ga('set', 'page', to.fullPath); // 你可能想根据请求参数添加其他参数，可以修改这里的 to.fullPath
//     window.ga('send', 'pageview');
//   }
// });
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
