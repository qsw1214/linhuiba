<template lang="html">
  <div class="invited-wraper">
    <img src="../../images/invite_bg.png" alt="a">
    <div class="code">
      <span>邀请码：</span>
      <span>{{ invite_code }}</span>
    </div>
    <p class="info">使用好友邀请码注册</p>
    <p class="info">成功下单或发布场地，您可获得¥100元现金</p>
    <div>
      <div class="tel">
        <span class="tel-icon"></span>
        <input type="number" v-model.trim="mobile" placeholder="请输入手机号码" maxlength="11">
      </div>

      <input v-if="show" type="text" v-model.trim="code" placeholder="请输入验证码" maxlength="6">
      <input v-if="show" type="text" v-model.trim="password" placeholder="请输入密码" maxlength="30">
    </div>
    <div class="scroll" ref="scroll">
      <div class="tip">向右滑动验证</div>
      <div class="inner" ref="inner">{{ scrollText }}</div>
      <div class="btn" ref="btn">

        <icon type="success" v-if="scrollText=='验证成功'"></icon>
        <span v-else> 》 </span>
      </div>
    </div>

    <div class="submit" v-if="showBtn" @click.stop="getCode">获取验证码</div>
    <div class="submit" v-else @click.stop="register">立即领取</div>

    <div class="desc">
      <div class="logo">
        <img src="../../images/newlogoinfo.png" alt="a">
      </div>
      <div class="text">
        <a href="https://m.linhuiba.com">【邻汇吧】</a>，快闪场地租赁平台，
        专注为品牌商的线下营销活动提供场地信息化、人群数据化服务。
        包括小区、商超、写字楼、园区、地铁、学校等15000+快闪场地在线租赁。
        目前业务覆盖北京、上海、广州、深圳、杭州、成都、天津等21个城市。

      </div>
    </div>
  </div>
</template>

<script>
  import { Icon } from 'vux';
  import { getStyle } from 'src/config/tools';
  import { MOBILE_REG , INT_SIX_REG , PASSWORD_REG } from 'src/config/data' ;
  import { sendCode , register } from 'src/service/getData' ;
export default {
  data () {
    return {
      scrollText: '' ,
      mobile : '' ,
      code : '' ,
      invite_code : this.$route.query.invite_code || '' ,
      password : '' ,
      show : false ,
      btnText : '获取验证码',
      showBtn : true ,
    }
  },
  components:{ Icon },
  mounted(){
    let oW = 0 ;
    let oBtn = this.$refs.btn ;
    let maxLeft = 0 ;
    let oLeft = 0 ;
    let flag = true ;
    oBtn.addEventListener('touchstart' , (e) => {
      if(flag){
        let touches = e.touches[0];
        oW = touches.clientX - oBtn.offsetLeft;
      }
    } , false );
    oBtn.addEventListener('touchmove' , (e) => {
      if(flag){
        let touches = e.touches[0];
        oLeft = touches.clientX - oW;//滑块拖动的距离
        let scroll = getStyle( this.$refs.scroll , 'width' ) ;
        maxLeft = scroll - getStyle( oBtn , 'width');//滑块可拖动的最大距离
        if(oLeft < 0) {
          oLeft = 0;
        }else if(oLeft > maxLeft) {
          oLeft = maxLeft;
        }
        oBtn.style.left = oLeft + "px";
        this.$refs.inner.style.width = oLeft + 'px';
      }
    } , false );
    oBtn.addEventListener('touchend' , (e) => {
      if(oLeft >= maxLeft){
        oBtn.style.left = maxLeft;
        this.$refs.inner.style.width = maxLeft;
        this.scrollText = '验证成功' ;
        flag = false ;
      }else{
        oBtn.style.left = 0;
        this.$refs.inner.style.width = 0;
      }
    } , false );
  },
  methods:{
    getCode(){
      if( this.scrollText=='验证成功' ){
        if(this.mobile){
          if( !MOBILE_REG.test(this.mobile) ){
            this.$vux.toast.text('请输入十一位有效手机号');
            this.mobile = '' ;
            return ;
          }
        }else {
          this.$vux.toast.text('请输入您的手机号');
          return ;
        }
        let params = {
          account : this.mobile ,
          usage : 1 ,
          resend_time : 60
        };
        this.$vux.toast.text('已发送');
        sendCode(params).then(res => {
          if(res.result.old_user){
            this.$vux.toast.text('用户已存在')
          }
          this.show = true ;
          this.showBtn = false ;
        }).catch(err => {
          this.$vux.toast.text(err.msg);
        });

      }else{
        this.$vux.toast.text('请拖动滑块到最右边验证身份');
        return ;
      }
    },
    register(){

      if(this.mobile){
        if( !MOBILE_REG.test(this.mobile) ){
          this.$vux.toast.text('请输入十一位有效手机号');
          this.mobile = '' ;
          return ;
        }
      }else {
        this.$vux.toast.text('请输入您的手机号');
        return ;
      }

      if(this.code){
        if( !INT_SIX_REG.test(this.code) ){
          this.$vux.toast.text('请输入4-6位有效数字验证码');
          this.code = '' ;
          return ;
        }
      }else {
        this.$vux.toast.text('请输入您手机上收到的验证码');
        return ;
      }

      if(this.password){
        if( !PASSWORD_REG.test(this.password) ){
          this.$vux.toast.text('请输入6-30位数字或字母组成的密码');
          this.password = '' ;
          return ;
        }
      }else {
        this.$vux.toast.text('请设置密码');
        return ;
      }

      let params = {
        account : this.mobile ,
        password : this.password ,
        captcha : this.code ,
        invite_code : this.invite_code ,
        channel : 'wap'
      };
      register(params).then(res => {
        this.$vux.toast.show({
          text :'注册成功！',
          type : 'success'
        });
        this.$router.push('/login');
      }).catch(err => {
        this.$vux.toast.text(err.msg);
      })
    }
  }
}

</script>

<style lang="scss" scoped>
  @import "../../style/mixin";
  .weui-icon-success{
    color: #09BB07 !important;
  }
  .invited-wraper{
    overflow: hidden;
    background-color: #fff;
    >img{
      @include wh(1.81rem,2.35rem);
      margin: 0.3rem auto 0;
    }
    .code {
      margin-top: 0.2rem;
      text-align: center;
      font-size: 0.3rem;
      color: $mainColor;
    }
    .info {
      margin-top: 0.2rem;
      text-align: center;
      font-size: 0.3rem;
      color: $fontColor;
    }
    input{
      display: block;
      @include wh(7rem,0.78rem);
      margin: 0.2rem auto;
      border: 1px solid $fontColor;
      font-size: 0.28rem;
      padding-left: 0.3rem;
    }
    .tel{
      position: relative;
      >input{
        padding-left: 0.7rem;
      }
      .tel-icon{
        position: absolute;
        top: 0.2rem;
        left: 0.45rem;
        @include wh(0.32rem,0.38rem);
        background: url('../../images/mobile.png') center no-repeat;
        background-size: 0.32rem  0.38rem;
      }
    }
    .scroll{
      margin: 0.2rem auto;
      @include wh(7rem,0.78rem);
      line-height: 0.78rem;
      text-align: center;
      background-color: #eee;
      position: relative;
      top: 0;
      left: 0;
      box-shadow: 0 0 2px #aaa;
      .tip{
        color: #666;
      }
      .inner{
        position: absolute;
        top: 0;
        left: 0;
        height: 0.78rem;
        width: 0;
        color: #fff;
        background-color: #09BB07;
      }
      .btn{
        position: absolute;
        top: 0;
        left: 0;
        @include wh(0.78rem , 0.78rem);
        text-align: center;
        font-size: 0.26rem;
        color: #999;
        background-color: #fff;
      }
    }
    .submit{
      margin: 0.2rem auto;
      @include wh(7rem,0.78rem);
      line-height: 0.78rem;
      text-align: center;
      @include sc(0.3rem,#fff);
      border-radius: 0.08rem ;
      background-color: $mainColor;
    }

    .desc{
      overflow: hidden;
      .logo{
        margin-top: 0.2rem;
        img{
          width: 2.4rem;
          margin: 0 auto;
        }
      }
      .text{
        line-height: 0.4rem;
        padding: 0.5rem;
        color: #999;
      }
    }
  }
</style>
