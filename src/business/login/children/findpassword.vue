<template lang="html">
  <div class="findpassword-wraper">
     <v-head go-back="true">
      <div slot="center-part" class="register">找回密码</div>
    </v-head>
    <form action="javascript:;" class="register-model">
      <label class="register-com border-1px"><span class="add-pre">+86</span><input type="number" placeholder="请输入手机号" autocomplete="off" class="mobile" v-model.trim="account"></label>
      <div class="register-com border-1px">
         <label class="code">
          <span class="com-left">验证码</span><input type="number" placeholder="请输入验证码" autocomplete="off" class="identifying" v-model.trim="captcha">
        </label>
        <div class="get-identifying" :class="{ active : account }">
          <span v-if="!interval"  @click="getIdentifying">获取验证码</span>
          <span v-else="interval" class="send">已发送( {{ interval }} )</span>
        </div>
        <div class="clear"></div>
      </div>

      <label class="register-com border-1px"><span class="com-left">密码</span><input
                                            type="password"
                                            placeholder="6-30位数字或字母"
                                            class="password"
                                            autocomplete="off"
                                            v-model.trim="password">
      </label>
      <label class="register-com border-1px"><span class="com-left">确认密码</span><input
                                            type="password"
                                            placeholder="请确认密码"
                                            class="confirm-password"
                                            autocomplete="off"
                                            v-model.trim="confirmPassword">
      </label>
      <!-- <label class="register-com border-1px"><span class="com-left">邀请码</span><input
                                            type="text"
                                            placeholder="请输入邀请码(选填)"
                                            class="invite-code"
                                            autocomplete="off"
                                            v-model.trim="invite_code">
      </label> -->
    </form>
    <div class="register-submit" @click="findPassword">
      找回密码
    </div>

  </div>
</template>

<script>
  import vHead from 'src/components/vHead' ;
  import { CAPTCHA_REG , MOBILE_REG , INT_SIX_REG , PASSWORD_REG } from 'src/config/data' ;
  import { sendMsg , captchaBoolean , resetPassword } from 'src/service/getData' ;
export default {
  data (){
    return {
      account : '',
      password : '',
      confirmPassword : '',
      captcha : '',
      invite_code : '',
      interval : 0
    }
  },
  components : {
    vHead
  },
  methods : {
    getIdentifying () {
      // 对电话号码做判断

      if( !MOBILE_REG.test( this.account ) ){
        this.$vux.toast.text('请输入11位有效手机号', 'middle') ;
        return ;
      }
      let dataMobile = this.account ;
      sendMsg( { account : dataMobile , usage : 2 } )
        .then( res => {
          this.$vux.toast.text('验证码发送成功' , 'middle');

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
    findPassword () {
      if( !MOBILE_REG.test( this.account ) ){
        this.$vux.toast.text('请输入11位有效手机号', 'middle') ;
        return ;
      }
      if( !INT_SIX_REG.test( this.captcha ) ){
        this.$vux.toast.text('请输入4-6位有效的数字验证码', 'middle') ;
        return ;
      }
      if( !PASSWORD_REG.test( this.password ) ){
        this.$vux.toast.text('请输入6-30位数字字母组成的密码', 'middle') ;
        return ;
      }
      if( this.password != this.confirmPassword ){
        this.$vux.toast.text('你两次输入的密码不一致,请重新输入', 'middle') ;
        return ;
      }
      if( this.invite_code ){
        if( !CAPTCHA_REG.test( this.invite_code ) ){
          this.$vux.toast.text('你输入的邀请码有误,请重新输入', 'middle') ;
          return ;
        }
      }

      let mobile = this.account ;
      let captcha = this.captcha ;
      captchaBoolean( { mobile  , captcha  } )
        .then( res => {
          // 验证码有效
          let params = {
            account : this.account ,
            password : this.password ,
            captcha : this.captcha ,
            password_confirmation : this.confirmPassword
          };
          resetPassword( params )
            .then( res => {
                this.$vux.toast.show({
                  text : '恭喜你，密码重置成功！' ,
                  type : 'success' ,
                  width : '33%'
                });
                // 返回首页
                this.$router.push( '/login' ) ;
            })
            .catch( err => {
              this.$vux.toast.show({
                text : err.msg ,
                type : 'cancel' ,
                width : '33%'
              })
            })
        })
        .catch( err => {
          this.$vux.toast.show({
            text : err.msg ,
            width : '33%' ,
            type : 'warn'
          }) ;
        })
    }
  }
}

</script>

<style lang="scss" scoped>
  @import "../../../style/mixin";
  .findpassword-wraper {
    @include allcover ;
    z-index: 100;
    background-color: $white;
  }
  .register-model {
    padding: 0 0.28rem;
    font-size: 0.28rem;
    line-height: 0.9rem;
    input {
      color : #666 ;
      font-size: 0.28rem;
    }
    .register-com {
      display: flex;
      @include bb-1px( #e8e8e8 );
      position: relative;
    }
    .add-pre {
      width: 1rem;
      line-height: 0.9rem;
      color: $mainColor;
      @include br-1px( #e8e8e8 );
    }
    .mobile {
      width: 5.7rem;
      padding-left: 0.32rem;
    }
    .confirm-password , .password , .invite-code{
      flex: 1;
    }
    .com-left {
      width: 1.34rem;
    }
    .code{
      display: flex;
      flex: 1;
    }
    .get-identifying {
      width: 1.9rem;
      text-align: center;
      position: relative;
      > span {
        display: block;
        color: #ccc;
      }
      &:before {
        content: "" ;
        position: absolute;
        top: 0;
        left: 0;
        @include wh( 0.01rem , 0.9rem );
        background-color: #e8e8e8;
      }
      &.active span {
        color: $mainColor ;
      }
      span.send {
        color: #ccc;
      }
    }
  }
  .register-submit {
    width: 7rem;
    height: 0.88rem;
    line-height: 0.88rem;
    margin: 0.77rem auto 0;
    border-radius: 0.04rem;
    text-align: center;
    color: #fff;
    font-size: 0.32rem;
    background-color: $mainColor;
    &.disabled {
      background-color: #ccc;
    }
  }

</style>






