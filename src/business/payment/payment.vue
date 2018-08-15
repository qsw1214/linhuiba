<template>
	<div class="payment">
		<v-head :path="paymentMode.group ? '/group?type=2' :  paymentMode.type == 'invoice' ? '/myInvoice' : '/myOrder'">
	    <div slot="center-part">支付方式</div>
	  </v-head>
	  <div class="white-bg">
	  	<div class="cell cell-padding">
	  		支付方式
	  	</div>
	  	<div class="cell-offset-padding">
		  	<div class="cell cell-item-padding">
		  		<input type="radio" v-model="pay" value="wechat" id="wechat">
		  		<label for="wechat">微信支付</label>
		  	</div>
		  	<div class="cell cell-item-padding" :class="{ hidden : envCheck() }">
		  		<input type="radio" v-model="pay" value="alipay" id="alipay">
		  		<label for="alipay">支付宝支付</label>
		  	</div>
		  	<div class="cell cell-item-padding" v-if="paymentMode.type != 'invoice'" :class="{ hidden : paymentMode.group }">
		  		<input type="radio" v-model="pay" value="offline" id="offline">
		  		<label for="offline">对公打款 <span class="tips">线下支付，需要转账证明</span></label>
		  	</div>
		  	<div class="cell cell-item-padding" v-if="openWallet">
		  		<input type="radio" v-model="pay" value="wallet" id="wallet" :disabled=" walletPrice <= 0 || walletPrice < paymentMode.price">
		  		<label for="wallet">钱包支付

            <span class="tips" v-if="walletPrice < paymentMode.price">余额不够呀！</span>
            <span class="tips" v-else>可用余额¥{{ walletPrice | twoPoint }}元</span>

          </label>
		  	</div>
		  </div>
	  </div>

		<pay-balance :pay-balance="show" @closeBalance="closeBalance" :sum="paymentMode.price" :orderId="paymentMode.order_id" :balanceType="paymentMode.type" :group="paymentMode.group">

		</pay-balance>

	  <div class="btn" @click="submitPay">
	  	确认支付
	  </div>
    <!--<form id='alipaysubmit' action="https://openapi.alipay.com/gateway.do?charset=UTF-8" method='POST'>-->
      <!--<input type='hidden' :name="key" :value="value" v-for="(value,key,index) in alipayConfig" :key="index">-->
    <!--</form>-->
	</div>
</template>

<script>
	import vHead from 'src/components/vHead'
	import payBalance from 'src/components/payBalance'
	import { FLOAT_REG, APPID_LOGIN } from 'src/config/data'
	import { wechatConfig, payWallet , payOrders, payInvoices , walletInfo } from 'src/service/getData'
	import { getStorage, getSession, setSession, removeSession } from 'src/config/tools'
  import { mapState } from 'vuex' ;
	import { twoPoint } from 'src/filters/index';
	export default {
//    0:线下支付
//    2:微信公众号支付
//    7:微信H5支付
//    9:支付宝手机网页支付
		data() {
			return {
				pay: 'wechat', // 默认微信支付
				show: false, // 钱包支付时的密码输入框默认关闭
        walletPrice : '' , // 钱包余额
        openWallet : true , // 默认开通了钱包
        paymentMode :  null , // 支付类型  {  price : 1000 , order_id : 52555 , type : 'order' , group : true }
        alipayConfig : null , // 支付宝支付配置
			}
		},
		filters : {twoPoint},
		components: {
			vHead,
			payBalance
		},
    created(){
      this.paymentMode = getSession('paymentModel') || this.$store.state.paymentModel ;
      console.log( this.paymentMode )
      if(!this.paymentMode){
        this.$router.replace('/home');
        return false;
      }
    },
		mounted() {
      this.init();
      // 先注入配置信息，然后开始调起微信支付
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
			this.wechatPay();
		},
		methods: {
      // 检查是否是微信内置浏览器
      envCheck() {
        let ua = navigator.userAgent.toLowerCase();
        if( ua.match(/MicroMessenger/i) == "micromessenger" ) {
          return true;
        }
        else {
          return false;
        }
      },
      init(){
        walletInfo().then(res => {
          // 获取钱包余额
          this.walletPrice = res.result.balance/100 ; // 分
        }).catch( err => {
          if( err.code == -2 ){
            this.openWallet = false ;
          }
        })
      },
			submitPay() {
				// 微信支付
				if(this.pay == 'wechat') {
					// 微信公众号支付
					if( this.envCheck() ) {
            // 微信浏览器
            let appId = APPID_LOGIN(); // appid
            let oldCode = this.getQueryString('code') ;
            let temp = '' ;
            if( oldCode ){
              temp = window.location.origin + window.location.hash ;
            }else{
              temp = window.location.href ;
            }
            let redirectUrl = encodeURIComponent( temp );
            let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ appId +'&redirect_uri='+ redirectUrl +'&response_type=code&scope=snsapi_userinfo&state=fox#wechat_redirect';
            window.location.href = url ;
					}
					//其他手机浏览器下的H5支付
					else {
              // 支付订单
            let id = this.paymentMode.order_id ;
            let params = {
              payment_mode : 7 ,
            };
            if(this.paymentMode.type == 'order') {

                payOrders(id, params).then(res => {
                  let r = res.result;
                  if(r.mweb_url) {
                    let redirect_url = window.location.origin + '/?shareRedirect=order/paySuccess' ;
                    if( this.paymentMode.group ){
                      redirect_url = window.location.origin + '/?shareRedirect=group/paySuccess' ;
                    }
                    let href = r.mweb_url + '&redirect_url=' + redirect_url ;
                    //  当前调起H5支付的域名与申请H5支付时提交的授权域名不一致
                    window.location.href = href;
                  }
                }).catch(err => {
                  this.$vux.toast.show({
                    text : err.msg ,
                    type : 'warn',
                    width : '25%'
                  })
                })

            }
              // 支付票据
            if(this.paymentMode.type == 'invoice') {

              payInvoices(id, params).then(res => {
                let r = res.result;
                if(r.mweb_url) {
                  let redirect_url = window.location.origin + '/?shareRedirect=invoice/paySuccess' ;
                  let href = r.mweb_url + '&redirect_url=' + redirect_url;
                  window.location.href = href;
                }
              }).catch(err => {
                this.$vux.toast.show({
                  text : err.msg ,
                  type : 'warn',
                  width : '25%'
                })
              })

            }
					}
				}
				// 支付宝支付
				if(this.pay == 'alipay') {
          let that = this ;
					// 支付订单
					if(this.paymentMode.type == 'order') {

            let id = this.paymentMode.order_id ;
            let params = {
              payment_mode : 9 ,
            };

            payOrders(id, params).then(res => {
              let config = res.result ;
              window.location.href = config ;
              // 修改后跳链接地址
//              config.return_url = window.location.origin + '/#/order/paySuccess' ;
//              if( this.paymentMode.group ){
//                config.return_url = window.location.origin + '/#/group/paySuccess' ;
//              }
//              this.alipayConfig = config ;
//              this.$vux.loading.show({
//                text : '正在调起支付宝支付...'
//              });
//
//              let interval = setTimeout(goalipay , 2000);
//              function goalipay() {
//                clearTimeout(interval);
//                that.$vux.loading.hide();
//                document.forms['alipaysubmit'].submit();
//              }
            }).catch(err => {
              this.$vux.toast.show({
                text : err.msg ,
                type : 'warn',
                width : '25%'
              })
            })

					}
					// 支付票据
					if(this.paymentMode.type == 'invoice') {

            let id = this.paymentMode.order_id ;
            let params = {
              payment_mode : 9 ,
            };

            payInvoices(id, params).then(res => {
              let config = res.result ;
              window.location.href = config ;
              // 修改后跳链接地址
              //config.return_url = window.location.origin + '/#/invoice/paySuccess' ;
//              this.alipayConfig = config ;
//              this.$vux.loading.show({
//                text : '正在调起支付宝支付...'
//              });
//
//              let interval = setTimeout(goalipay , 2000);
//              function goalipay() {
//                clearTimeout(interval);
//                that.$vux.loading.hide();
//                document.forms['alipaysubmit'].submit();
//              }
            }).catch(err => {
              this.$vux.toast.show({
                text : err.msg ,
                type : 'warn',
                width : '25%'
              })
            })
					}
				}

				// 对公打款
				if(this.pay == 'offline') {

					// 支付订单
					if(this.paymentMode.type == 'order') {
            let id = this.paymentMode.order_id ;
            let params = {
              payment_mode : 0 ,
            };
            payOrders(id, params).then(res => {
              // 保存线下支付的类型
              setSession('offline-type' , 'order');
              // 调往 上传凭证 页面
              this.$router.push({name:'offline',params: { id:id } , query : { source : 'order' }}) ;
            }).catch(err => {
              this.$vux.toast.show({
                text : err.msg ,
                type : 'warn',
                width : '25%'
              })
            })
					}

				}

				// 钱包支付
				if(this.pay == 'wallet') {
					this.show = true; // 显示输入密码组件
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
			wechatPay() {

        let code = this.getQueryString('code');
        let that = this ;
				if(code) {
          this.$vux.loading.show( { text : '支付中...'} );
          let id = this.paymentMode.order_id ;
          let params = {
            payment_mode : 2 ,
            code : code
          };

					// 支付订单
					if(this.paymentMode.type == 'order') {

            payOrders( id , params ).then(res => {
              that.$vux.loading.hide();
              that.$wechat.ready(function () {
                that.$wechat.chooseWXPay({
                  appId: res.result.appId,
                  timestamp: res.result.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                  nonceStr: res.result.nonceStr, // 支付签名随机串，不长于 32 位
                  package: res.result.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                  signType: res.result.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                  paySign: res.result.paySign, // 支付签名
                  success: function() {
                    let origin = window.location.origin ;
                    let url = "" ;
                    if( that.paymentMode.group ){
                      url = origin +'/?shareRedirect=group/paySuccess';
                    }else{
                      url = origin +'/?shareRedirect=order/paySuccess';
                    }
                    window.location.href = url ;
                  },
                  fail : function (res) {
                    that.$vux.toast.text(JSON.stringify(res));
                  }
                });
              });

            }).catch(err => {
              this.$vux.loading.hide();
              this.$vux.toast.show({
                text : err ,
                type : 'warn',
                width : '25%'
              })
            })
					}
					// 支付票据
					if(this.paymentMode.type == 'invoice') {

            payInvoices(id, params).then(res => {
              that.$vux.loading.hide();
              that.$wechat.ready(function () {
                that.$wechat.chooseWXPay({
                  appId: res.result.appId,
                  timestamp: res.result.timestamp,
                  nonceStr: res.result.nonceStr,
                  package: res.result.package,
                  signType: res.result.signType,
                  paySign: res.result.paySign,
                  success: function() {
                    let origin = window.location.origin ;
                    let url = origin +'/?shareRedirect=invoice/paySuccess';
                    window.location.href = url ;
                  }
                });
              });

            }).catch(err => {
              this.$vux.loading.hide();
              this.$vux.toast.show({
                text : err ,
                type : 'warn',
                width : '25%'
              })
            })
					}
				}

			},
			closeBalance() {
				this.show = false;
			}

		}
	}
</script>

<style lang="scss" scoped>
	@import "../../style/mixin";

	// 单选按钮样式
	input[type="radio"] {
		 display: none
	}

	label {
	  display: inline-block;
	  width: 100%;
	  line-height: 0.4rem
	}

	input[type="radio"]:checked + label {
	  background-image: url('../../images/ic_selected_two_four_one@2x.png')
	}

	input[type="radio"] + label {
	  background: url('../../images/ic_unchecked_two_four_one@2x.png') left center no-repeat;
	  background-size: 0.36rem 0.36rem;
	  padding-left: 0.5rem;
	  min-height: 0.4rem
	}

	.router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
   }

  .router-slid-enter, .router-slid-leave-active {
    transform: translateX( 100% );
    opacity: 0;
  }

	.payment {
    width: 100%;
    overflow: hidden;
		font-size: 0.28rem;
		.hidden {
			display: none
		}
		.cell-padding {
			padding: 0.25rem 0.3rem;
      border-bottom: 1px solid #e8e8e8;
		}
		.cell-offset-padding {
			padding: 0 0.3rem
		}
		.cell-item-padding {
			padding: 0.25rem 0 ;
      border-bottom: 1px solid #e8e8e8;
		}
		.white-bg {
			background: $white
		}
		.margin-small {
			margin-top: 0.2rem
		}
		.padding-left-normal {
			padding-left: 0.2rem
		}
		.cell {
			position: relative;
      .tips{
        @include sc(0.26rem , #999);
      }
			&:last-child {
				border: none;
			}
		}

		.btn {
			width: 90%;
			height: 0.88rem;
			line-height: 0.88rem;
			text-align: center;
			border-radius: 0.04rem;
			color: $white;
			background: $mainColor;
			margin: 0.4rem auto;
			font-size: 0.32rem
		}
	}
</style>
