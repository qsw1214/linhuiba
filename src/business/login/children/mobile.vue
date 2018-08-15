<template lang="html">
<div class="mobile-login-wraper">
   <v-head go-back="true">
      <div slot="center-part">快速登录</div>
      <div slot="right-part" class="rt register">
        <router-link to="/register" tag="a">注册</router-link>
      </div>
    </v-head>
    <div class="login-welcome">
      <p class="greetings">您好，</p>
      <p class="welcome">欢迎来到邻汇吧！</p>
    </div>
    <form action="javascript:;" class="login-modal">
      <label class="login-mobile border-1px">
        <!-- <span class="com-text">手机号</span> -->
        <input type="number" placeholder="请输入手机号" autocomplete="off" class="mobile" v-model.trim="account" @input ="inputFunc">
      </label>
      <div class="clear login-identifying border-1px">
         <label class="code">
          <!-- <span class="com-text">验证码</span> -->
          <input type="number" placeholder="请输入短信验证码" autocomplete="off" class="identifying" v-model.trim="captcha" @input ="inputFunc">
        </label>
        <div class="get-identifying" :class="{ active : account.length >= 6 }" ref="sms">
          <span v-if="!interval"  @click="getIdentifying">获取验证码</span>
          <span v-else="interval" class="send">已发送( {{ interval }} )</span>
        </div>
      </div>

    </form>
     <div class="login-submit" @click="login" ref="submit">
      登录
    </div>
    <div class="clear other-login">
      <div class="left">
        <router-link class="phone-login" :to="{ path : '/login' , query : this.$route.query }">账号密码登录</router-link>
      </div>
    </div>
</div>
</template>

<script>
  import vHead from 'src/components/vHead' ;
  import { MOBILE_REG , INT_SIX_REG } from 'src/config/data' ;
  import { sendMsg , captchaBoolean , fastLogin } from 'src/service/getData' ;
  import { mapState , mapMutations } from 'vuex' ;
export default {
    data () {
        return {
          account : '' ,
          captcha : '',
          interval : 0
        }
    },
    components : {
        vHead
    },

    methods : {
      ...mapMutations([
          'RECORD_USERINFO'
      ]),
      getIdentifying () {
        // 对电话号码做判断
        console.log(typeof this.account );
        if( !MOBILE_REG.test( this.account ) ){
          this.$vux.toast.text('请输入11位有效手机号', 'middle') ;
          return ;
        }
        let dataMobile = this.account ;
        sendMsg( { account : dataMobile , usage : 2 } )
          .then( res => {
            this.$vux.toast.text('验证码发送成功' , 'middle');
            this.$refs.sms.style.background = '#B2D6FF';
            this.interval = 60 ;
            this.timer = setInterval( () => {
                this.interval -- ;
                if( this.interval == 0 ){
                    clearInterval( this.timer ) ;
                }
            }, 1000 );
          })
          .catch ( err => {
            this.$vux.toast.text( err.msg , 'middle') ;
          });
      },
      login () {
        if( !MOBILE_REG.test( this.account ) ){
          this.$vux.toast.text('请输入11位有效手机号', 'middle') ;
          return ;
        }
        if( !INT_SIX_REG.test( this.captcha ) ){
          this.$vux.toast.text('请输入4-6位有效的数字验证码', 'middle') ;
          return ;
        }
        let mobile = this.account ;
        let captcha = this.captcha ;
        captchaBoolean( { mobile  , captcha  } )
          .then( res => {
              // 验证码有效
            let account = this.account ;
            let captcha = this.captcha ;
            fastLogin( { account , captcha , channel : 'wap' } )
              .then( res => {
                this.RECORD_USERINFO( res.result );
                if(!res.result.mobile) {
                  // 跳转到绑定手机号页面
                  this.$router.replace({ path : '/bindMobile' , query : {redirect : this.$route.query.redirect } });
                }else{
                  this.$vux.toast.show({
                    text : '登录成功',
                    type : 'success',
                    width : '25%'
                  });
                  let redirect = this.$route.query.redirect ;
                  if(redirect) {
                    this.$router.push( redirect );
                  }
                  else {
                    this.$router.push('/home');
                  }
                }
              })
              .catch( err => {
                this.$vux.toast.show({
                  text : err.msg ,
                  type : 'warn',
                  width : '25%'
                });
              });
          })
          .catch( err => {
            this.$vux.toast.show({
              text : err.msg ,
              width : '33%' ,
              type : 'warn'
            }) ;
            return ;
          })
      },
      inputFunc () {
        if (this.account.length !== 0 && this.captcha.length !== 0 ) this.$refs.submit.style.background = '#0077FF';
      }

    }
}

</script>

<style lang="scss" scoped>
  @import "../../../style/mixin";
  .mobile-login-wraper {
    @include allcover ;
    z-index: 100;
    background-color: $white;
  }
  .register a{
    font-size: 0.28rem ;
    color: $gray ;
  }
  .login-welcome {
    padding: .98rem .26rem 1.1rem .26rem;
    .greetings {
      font-size: 28px;
      color: #282A2A;
      letter-spacing: 0;
      line-height: 28px;
      padding-bottom: .30rem
    }
    .welcome {
      font-size: 16px;
      color: #666666;
      letter-spacing: 0;
      line-height: 16px;
    }
  }
  .login-modal {
    padding: 0 0.28rem;
    font-size: 0.28rem;
    .login-mobile ,.login-identifying {
      display: flex;
      align-items: center;
      @include wh( 100% , 1.04rem );
      @include bb-1px( #e8e8e8 );
    }
    .code{
      flex: 1;
      display: flex;
    }
    .com-text {
      margin-right: 0.2rem;
    }
    .mobile {
      flex: 1;
      font-size: .32rem;
    }
    .identifying {
      width: 3.9rem;
      font-size: .32rem;
    }
    .get-identifying {
      width: 2rem;
      text-align: center;
      position: relative;
      background-color: $noEnter;
      border-radius: 2px;
      > span {
        display: block;
        color: #FFFFFF;
        padding: .22rem 0;
        line-height: .29rem;
      }
      &:before {
        content: "" ;
        position: absolute;
        top: 0;
        left: 0;
        @include wh( 0.01rem , 100% );
        background-color: #e8e8e8;
      }
      &.active  {
        background-color: $mainColor;
      }
      span.send {
        color: white;
      }
    }
  }

  .login-submit {
    width: 7rem;
    height: 0.88rem;
    line-height: 0.88rem;
    margin: 0.8rem auto 0;
    border-radius: 0.04rem;
    text-align: center;
    color: #fff;
    font-size: 0.32rem;
    background-color: $noEnter;
  }
  .other-login {
    margin-top: 0.4rem;
    padding: 0 0.28rem;
    a {
      color: $gray ;
      font-size: .28rem;
    }
  }

</style>
