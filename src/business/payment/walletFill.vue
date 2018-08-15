<!--钱包充值支付专用模块-->
<template lang="html">
  <div>
    <v-head path="/wallet">
      <div slot="center-part">充值</div>
    </v-head>
    <div class="title">支付方式</div>
    <div class="pay-way">
      <div class="item">

        <label class="way"><input type="radio" v-model="payWay" value="wechat">微信支付</label>
      </div>
      <div class="item">

        <label class="way"><input type="radio" v-model="payWay" value="offline">对公打款</label>
      </div>
      <div class="item" v-if="!envCheck()">

        <label class="way"><input type="radio" v-model="payWay" value="alipay">支付宝支付</label>
      </div>
    </div>
    <div class="price">
      <label class="label"><span>金额</span><input type="number" v-model="price" placeholder="请输入需要充值的金额"></label>
    </div>
    <div class="submit" @click="submit">去充值</div>
    <form id='alipaysubmit' action="https://openapi.alipay.com/gateway.do?charset=UTF-8" method='POST' v-if="alipayConfig">
       <input type='hidden' :name="key" :value="value" v-for="(value,key,index) in alipayConfig" :key="index">
    </form>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead';
  import { FLOAT_REG, APPID_LOGIN } from 'src/config/data';
  import { payWallet , wechatConfig } from 'src/service/getData';
  import { setSession } from 'src/config/tools';
export default {
  data () {
    return {
      payWay : 'wechat',
      price : '',
      alipayConfig : null ,
    }
  },
  components:{vHead},
  mounted(){
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
      this.$vux.toast.text(err);
    });
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
          amount : sum*100 ,
          payment_mode : 2,
          code : code
        };
        payWallet(params).then(res => {
          let id = res.result.transaction_id ;
          setSession('walletId' , id );
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

                let url = window.location.origin +'/?shareRedirect=wallet/success' ;
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
    submit(){
      if(this.price){
        if(!FLOAT_REG.test(this.price)){
          this.$vux.toast.text('您输入的金额必须为数字或者小数');
          this.price = '';
          return false;
        }
      }else{
        this.$vux.toast.text('金额不能为0');
        return false;
      }
      if(this.payWay === 'wechat'){
      // 微信支付
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
          // 网页h5
          let obj = {
            amount : this.price*100 ,
            payment_mode : 7
          };
          payWallet(obj).then(res => {
            let r = res.result;
            let id = r.transaction_id;
            setSession('walletId' , id );
            if(r.mweb_url) {
              let redirect_url = window.location.origin + '/?shareRedirect=wallet/success' ;
              let href = r.mweb_url + '&redirect_url=' + redirect_url;
            //  当前调起H5支付的域名与申请H5支付时提交的授权域名不一致
              window.location.href = href;
            }
          }).catch(err => {

            this.$vux.toast.show({
              type : 'warn',
              text : err.msg ,
              width : '25%'
            })
          })
        }
      }else if(this.payWay === 'offline'){
      // 线下支付

        let obj = {
          amount : this.price*100 ,
          payment_mode : 0
        };
        payWallet(obj).then(res => {
          let id = res.result.transaction_id ;
          // 保存线下支付的类型
          setSession('offline-type' , 'wallet');
          // 调往 上传凭证 页面
          this.$router.push({name:'offline',params: {id:id}}) ;
        }).catch(err => {
          this.$vux.toast.show({
            type : 'warn',
            text : err.msg ,
            width : '25%'
          })
        })

      }else{
      // 支付宝支付
        let obj = {
          amount : this.price*100 ,
          payment_mode : 9
        };
        payWallet(obj).then(res => {

          let href = decodeURIComponent(res.result) ;
          function getId(link , name){
            let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            let r = link.split('?')[1].match(reg);
            if (r != null) {
              return unescape(r[2]);
            }
            return null;
          }
          let biz_content = getId( href , 'biz_content' );
          let idBox = JSON.parse( biz_content );
          let idobj = JSON.parse( idBox.passback_params ) ;
          let id = idobj.transaction_id ;
          setSession('walletId' , id );
          window.location.href = res.result ;
        }).catch(err => {
          this.$vux.toast.show({
            type : 'warn',
            text : err.msg ,
            width : '25%'
          })
        })
      }
    }
  }
}

</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  .title{
    padding: 0 0.24rem;
    line-height: 0.9rem;
    border-bottom: 1px solid #e8e8e8;
    background-color: #fff;
    font-size: 0.28rem;
    color: $fontColor;
  }
  .pay-way{
    padding: 0 0.24rem;
    background-color: #fff;
    .item{
      line-height: 0.9rem;
      border-bottom: 1px solid #e8e8e8;
      font-size: 0;
      .way{
        display: block;
        font-size: 0.28rem;
        input{
          vertical-align: middle;
          @include wh(0.36rem,0.36rem);
          margin-right: 0.2rem;
          @include bg-image('../../images/ic_unchecked_two_four_one');
          &:checked{
            @include bg-image('../../images/ic_selected_two_four_one');
          }
        }
      }
    }
  }
  .price{
    padding: 0 0.24rem;
    margin-top: 0.2rem;
    line-height: 0.9rem;
    background-color: #fff;
    .label{
      display: block;
      height: 0.9rem;
      input{
        vertical-align: top;
        margin-left:0.2rem;
        @include wh(6.25rem , 0.9rem);
        font-size: 0.28rem;
      }
    }
  }
  .submit{
    @include wh(7rem,0.9rem );
    margin: 0.8rem auto;
    line-height: 0.9rem;
    text-align: center;
    color: #fff;
    font-size: 0.34rem;
    border-radius: 0.08rem;
    background-color: $mainColor;
  }
</style>
