<template lang="html">
  <div class="login-wraper">
    <v-head path="/home">
      <div slot="center-part">登录</div>
      <div slot="right-part" class="rt register">
        <router-link to="/register" tag="a">注册</router-link>
      </div>
    </v-head>
    <div class="login-welcome">
      <p class="greetings">您好，</p>
      <p class="welcome">欢迎来到邻汇吧！</p>
    </div>
    <form action="javascript:;" class="login-modal">
      <label class="login-com border-1px">
        <!-- <span>账号</span> -->
        <input type="text" placeholder="请输入手机号码/用户名" class="account" autocomplete="off" v-model.trim="account" @input ="inputFunc">
      </label>
      <label class="login-com border-1px">
        <!-- <span>密码</span> -->
        <input type="password" placeholder="请输入密码" class="password" autocomplete="off" v-model.trim="password" @input ="inputFunc">
      </label>
    </form>
    <div class="login-submit" @click="login( account , password )" ref="submit">
      登录
    </div>
    <div class="clear other-login">
      <div class="left">
        <router-link class="phone-login" :to="{ path : '/login/mobilelogin' , query : this.$route.query }">手机快捷登录</router-link>
      </div>
      <div class="right">
        <router-link to="/login/findpassword">忘记密码?</router-link>
      </div>
    </div>
    <div class="wx-login-wraper" v-if="envCheck()">
      <div class="title">其他登录方式</div>
      <div class="wx-login" @click="wxLogin">
        <div class="wx-img"></div>
        <!-- <div class="wx-text">微信登录</div> -->
      </div>
    </div>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead';
  import { MOBILE_REG , PASSWORD_REG , COMPANY_REG} from '../../config/data' ;
  import { postLogin ,wechatLogin , getCurrentCity } from 'src/service/getData' ;
  import { mapState, mapMutations } from 'vuex';
  import { APPID_LOGIN } from 'src/config/data' ;
  export default {
    data () {
      return {
        account : '' ,
        password : ''
      }
    },
    mounted () {
        this.readyWxLogin();

    },
    components : {
      vHead
    },
    methods : {
      ...mapMutations([
          'RECORD_USERINFO'
      ]),
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
      login (account , password){
        if ( !COMPANY_REG.test(account) ){
            // 手机号输入不对
          this.$vux.toast.text('请输入11位有效手机号或者账号', 'middle') ;
          return ;
        }
        if ( !PASSWORD_REG.test(password) ){
          // 密码包含其他字符
          this.$vux.toast.text('请检查您输入的密码是否为6-30数字和字母', 'middle');
          return ;
        }
        postLogin( { account , password } )
        .then( res => {
          this.RECORD_USERINFO( res.result );
          if(!res.result.mobile) {
            // 跳转到绑定手机号页面
            this.$router.push({ path : '/bindMobile' , query : {redirect : this.$route.query.redirect } });
          }else{
            this.$vux.toast.show({
              text : '登录成功',
              type : 'success',
              width : '25%'
            });
            let redirect = this.$route.query.redirect ;
            if(redirect) {
              let temp = window.location.origin + '/#' + redirect ;
              window.location.href = temp ;
              // this.$router.replace( redirect ); 会存在跳转失败的情况
            }else {
              // 避免授权的bug;
              let temp2 = window.location.origin + '/#/home' ;
              window.location.href = temp2 ;
              // this.$router.replace({ path : '/home' });
            }
          }
        })
        .catch( err => {
          this.$vux.toast.text(err.msg);
        })
      },
      wxLogin () {
        let appId = APPID_LOGIN() ;
        // 避免第二次授权问题
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
      },
      getQueryString(name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        let r = window.location.search.substr(1).match(reg);
        if (r != null) {
          return unescape(r[2]);
        }
        return null;
      },
      readyWxLogin () {
        let code = this.getQueryString('code');
        if(!code) {
          return ;
        } else {
          let params = {
            code: code ,
            channel : 'wap'
          } ;
          wechatLogin( params ).then( res => {
            this.RECORD_USERINFO( res.result );
            if(!res.result.mobile) {
              // 跳转到绑定手机号页面  并且去掉链接中的code 参数，避免授权的bug;
              let redirect = this.$route.query.redirect ;
              let url = window.location.origin + '/#/bindMobile?redirect='+ redirect ;
              window.location.href = url ;
            }else{
              this.$vux.toast.show({
                text : '登录成功',
                type : 'success',
                width : '25%'
              });
              let redirect = decodeURIComponent( this.$route.query.redirect ) ;
              if(redirect) {
                // 避免授权的bug;
                let temp = window.location.origin + '/#' + redirect ;
                window.location.href = temp ;
              }
              else {
                // 避免授权的bug;
                let temp2 = window.location.origin + '/#/home' ;
                window.location.href = temp2 ;
              }
            }
          })
          .catch( err => {
            this.$vux.toast.text(err.msg);
          })
        }
      },
      inputFunc () {
        if (this.account.length !== 0 && this.password.length !== 0 ) this.$refs.submit.style.background = '#0077FF'
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import '../../style/mixin' ;
  .router-slid-enter-active, .router-slid-leave-active {
    transition: all .2s;
  }
  .router-slid-enter {
    transform: translateX( 100% );
  }
  .router-slid-leave-active{
    opacity: 0;
  }
  .login-wraper{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
  }
  .register a {
    font-size: 0.28rem;
    color: $gray ;
  }
  .login-welcome {
    padding: .98rem .26rem 1.08rem .26rem;
    .greetings {
      font-size: 28px;
      color: #282A2A;
      letter-spacing: 0;
      line-height: 28px;
      padding-bottom: .30rem
    }
    .welcome {
      font-size: 18px;
      color: #666666;
      letter-spacing: 0;
      line-height: 18px;
    }
  }
  .login-modal {
    padding: 0 0.28rem;
    .login-com {
      display: flex;
      align-items: center;
      @include wh( 100% , 1.02rem );
      @include bb-1px( #e8e8e8 );
      > span {
        font-size: 0.28rem;
        margin-right: 0.2rem;
        color: #333;
      }
      > input {
        flex: 1;
        font-size: .32rem;
        color: #666;
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
  .wx-login-wraper {
    padding: 2rem 0.28rem 0.8rem;
    text-align: center;
    background-color: white;
    .title {
      font-size: 0.28rem;
      color: #d2d2d2;
      position: relative;
      &:before {
        content : "";
        position: absolute;
        @include wh( 2.4rem , 1px );
        top: 0.15rem;
        left: 0;
        background-color: #d2d2d2;
      }
      &:after {
        content : "";
        position: absolute;
        @include wh( 2.4rem , 1px );
        top: 0.15rem ;
        right: 0;
        background-color: #d2d2d2;
      }
    }
    .wx-login {
      margin-top: 0.8rem;
      .wx-img {
        @include wh( 0.8rem , 0.8rem );
        margin: 0 auto;
        @include bg-image( '../../images/ic_weixin_three_three' );
      }
      .wx-text {
        margin-top: 0.2rem;
        font-size: 0.24rem;
        color: #999;
      }
    }
  }
</style>
