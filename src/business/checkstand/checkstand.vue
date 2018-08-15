<template lang="html">
  <div class="checkstand">
     <div class="title">收银台</div>
     <div class="name">
        <div class="tit">收款人</div>
        <div class="company">{{ company || '邻汇网络科技有限公司' }}</div>
     </div>
     <div class="price">
        <p class="tit">付款金额</p>
        <p class="ipt"><span class="price-pre">¥</span><input type="number" v-model.trim="price" class="number"><span class="info">（已跟商家确认）</span></p>

     </div>
     <x-button type="default" text="确认支付" class="submit-order" @click.native="submitOrder" :show-loading="showsubloading" :disabled="showsubloading"></x-button>
     <form id='alipaysubmit' action="https://openapi.alipay.com/gateway.do?charset=UTF-8" method='POST' v-if="alipayConfig">
       <input type='hidden' :name="key" :value="value" v-for="(value,key,index) in alipayConfig" :key="index">
     </form>
  </div>
</template>

<script>
import { XButton } from 'vux';
import { FLOAT_REG , APPID_LOGIN } from 'src/config/data' ;
import { paidOffline , wechatConfig } from 'src/service/getData';
export default {
  data () {
    return {
      showsubloading : false ,
      price: '',
      id : undefined ,
      alipayConfig : null ,
      company : ''
    }
  },
  components: { XButton } ,
  created(){
    wechatConfig().then(res => {
      this.$wechat.config({
        debug: false,
        appId: res.result.appId,
        timestamp : res.result.timestamp,
        nonceStr : res.result.nonceStr,
        signature : res.result.signature,
        jsApiList: [
          'chooseWXPay'
        ]
      });
    }).catch(err => {
      this.$vux.toast.text('微信配置失败');
    });
  },
  mounted(){
    this.id = this.$route.params.id ;
    this.company = this.$route.query.company ;
    this.payWacth();
  },
  methods:{
    // 检查是否是微信内置浏览器
    envCheck() {
      let ua = window.navigator.userAgent.toLowerCase();
      if( ua.match(/MicroMessenger/i) == "micromessenger" ) {
        return true;
      }else {
        return false;
      }
    },
    getQueryString(name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
      let r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return null;
    },
    payWacth(){
      let that = this ;
      let code = this.getQueryString('code');
      let sum  = this.getQueryString('state');

      if(code){
        this.$vux.loading.show( { text : '支付中...'} );
        let params = {
          amount : sum*1 ,
          payment_mode : 2,
          payee_id : this.id ,
          code : code
        };
        paidOffline(params).then(res => {
          let obj = res.result ;
          that.$vux.loading.hide();
          that.$wechat.ready(function () {
            that.$wechat.chooseWXPay({
              appId: obj.appId,
              timestamp: obj.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
              nonceStr: obj.nonceStr, // 支付签名随机串，不长于 32 位
              package: obj.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
              signType: obj.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign: obj.paySign, // 支付签名
              success: function(res) {
                let url = window.location.origin +'/?shareRedirect=checkstandSuccess?amount='+ sum ;
                window.location.href = url ;
              },
              fail: function(err) {
                that.$vux.toast.text('支付失败')
              }
            });
          });

        }).catch(err => {
          that.$vux.loading.hide();
          that.$vux.toast.show({
            type : 'warn',
            text : err.msg ,
            width : '25%'
          })
        })
      }
    },
    submitOrder(){
      let that = this ;
      if( +this.price ){
        if( !FLOAT_REG.test( this.price ) ){
          this.$vux.toast.text('付款金额必须为整数或者小数');
          return ;
        }
      }else{
        this.$vux.toast.text('请数入有效金额');
        return ;
      }
      this.showsubloading = true ;
      if(this.envCheck()){
        // 微信浏览器
        let appId = APPID_LOGIN(); // appid
        // 避免在登录授权或者微信绑定界面授权时在链接中加入了code ;
        let oldCode = this.getQueryString('code') ;
        let temp = '' ;
        if( oldCode ){
          temp = window.location.origin + window.location.hash ;
        }else{
          temp = window.location.href ;
        }
        let redirectUrl = encodeURIComponent( temp );
        let price = this.price ;
        let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ appId +'&redirect_uri='+ redirectUrl +'&response_type=code&scope=snsapi_userinfo&state='+ price +'#wechat_redirect';
        window.location.href = url ;
      }else{
        let params = {
          amount : this.price*1 ,
          payment_mode : 9,
          payee_id : this.id
        };
        paidOffline(params).then(res => {
          let config = res.result ;
          this.alipayConfig = config ;
          this.$vux.loading.show({
            text : '支付中...'
          });

          let interval = setTimeout(goalipay , 2000);
          function goalipay() {
            clearTimeout(interval);
            that.$vux.loading.hide();
            document.forms['alipaysubmit'].submit();
          }
        }).catch(err => { this.$vux.toast.text( err.msg ) })
      }
    }
  },
  destroyed(){
    this.showsubloading = false ;
  }
}

</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  .checkstand{
    overflow: hidden;
    background-color: #fff;
    .title{
      height: 0.9rem;
      line-height: 0.9rem;
      text-align: center;
      font-size: 0.32rem;
      color: #fff;
      background-color: #333;
    }
    .name{
      padding: 0.6rem 0.24rem 0;
      display: flex;
      align-items: center;
      .tit{
        width: 1.5rem;
      }
    }
    .price{
      padding: 0.6rem 0.24rem 0;
      .ipt{
        display: flex;
        justify-content: space-between;
        margin-top: 0.3rem;
        line-height: 0.66rem;
        .price-pre{
          @include sc(0.4rem, #333);
        }
        .number{
          width: 4rem;
          @include sc(0.6rem, #333);
        }
        .info{
          @include sc(0.28rem, #999);
        }
      }
    }
  }
  .submit-order{
    @include wh( 90% , 1rem );
    margin: 0.6rem auto 0.8rem;
    line-height: 1rem;
    text-align: center;
    font-size: 0.34rem;
    color: #fff;
    background-color: $mainColor;
    &:active{
      color: #fff !important;
      background-color: $mainColor !important;
    }
    &:disabled{
      color: #fff !important;
      background-color: $mainColor !important;
    }
  }
</style>
