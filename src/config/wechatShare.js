
import Vue from 'vue' ;
import { WechatPlugin } from 'vux';
import { wechatConfig } from 'src/service/getData';
Vue.use( WechatPlugin );
let wx = Vue.wechat ;

function wxshare( shareData ){
  let defaultData = {
    title : '【邻汇吧】- 快闪场地租赁平台' ,
    link : window.location.origin ,
    imgUrl : 'https://comment.linhuiba.com/FgKZMHwcsI-0sAC0mbk6BgzGNLCy',
    desc: '邻汇吧,快闪场地租赁平台,地推场地在线预订平台,将小区、园区、写字楼、商超、高校、影院闲置场地上的人流量变现,让您像订电影票一样的订地推场地。', // 分享描述
  };
  let data = { ...defaultData , ...shareData } ;
 // 获取签名的接口
  wechatConfig().then(res => {
    wx.config({
      debug : false,
      appId : res.result.appId,
      timestamp : res.result.timestamp,
      nonceStr : res.result.nonceStr,
      signature : res.result.signature,
      jsApiList : [
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'onMenuShareQZone']
    });
  });


 wx.ready(function(){
  wx.onMenuShareTimeline({
    title: data.title, // 分享标题
    link: data.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: data.imgUrl, // 分享图标
    success: function () {
      // 用户确认分享后执行的回调函数
    },
    cancel: function () {
      // 用户取消分享后执行的回调函数
    }
  });
  wx.onMenuShareAppMessage({
    title: data.title, // 分享标题
    desc: data.desc, // 分享描述
    link: data.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: data.imgUrl, // 分享图标
    type: '', // 分享类型,music、video或link，不填默认为link
    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
    success: function () {
      // 用户确认分享后执行的回调函数
    },
    cancel: function () {
      // 用户取消分享后执行的回调函数
    }
  });
  wx.onMenuShareQQ({
    title: data.title, // 分享标题
    desc: data.desc, // 分享描述
    link: data.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: data.imgUrl, // 分享图标
    success: function () {
      // 用户确认分享后执行的回调函数
    },
    cancel: function () {
      // 用户取消分享后执行的回调函数
    }
  });
  wx.onMenuShareWeibo({
    title: data.title, // 分享标题
    desc: data.desc, // 分享描述
    link: data.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: data.imgUrl, // 分享图标
    success: function () {
      // 用户确认分享后执行的回调函数
    },
    cancel: function () {
      // 用户取消分享后执行的回调函数
    }
  });
  wx.onMenuShareQZone({
    title: data.title, // 分享标题
    desc: data.desc, // 分享描述
    link: data.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: data.imgUrl, // 分享图标
    success: function () {
      // 用户确认分享后执行的回调函数
    },
    cancel: function () {
      // 用户取消分享后执行的回调函数
    }
  });
});
}

export { wxshare } ;
