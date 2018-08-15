<template lang="html">
  <div class="change-mobile-wrap">
      <v-head go-back="true">
        <div slot="center-part">修改手机号码</div>
      </v-head>
      <section class="CM-content">
        <!-- <div class="CM-top">
          <span class="active"  @click.stop="showCheckOldMobile">1.验证身份</span>
           <i class="ic-center"></i>
           <span>2.验证新手机号</span>
        </div> -->
        <div class="CM-OriginalPhone">
          <p>验证原手机：</p>
        </div>
        <div class="CM-bottom">
          <input class="CM-input" type="number" disabled v-model='userProfile.mobile'  placeholder="请输入手机号码" />
        </div>
        <div class="CM-center">
          <input class="bor-b" placeholder="请输入短信验证码" maxlength="6" type="text" v-model='data.old_mobile_captcha' @input="inputFunc"/>
          <span  :class="userProfile.mobile.length > 0 ? 'send' : 'noSend'" @click.stop="sendOldCaptcha" ref="oldCaptcha">{{oldInterval?`已发送(${oldInterval})`:'发送验证码'}}</span>
        </div>
        <div class="CM-OriginalPhone pt-41">
          <p>验证新手机：</p>
        </div>
        <div class="CM-bottom">
          <input class="CM-input" type="number" v-model='data.new_mobile' placeholder="请输入新手机号码"  @input="inputFunc"/>
        </div>
        <div class="CM-center">
          <input class="" placeholder="请输入短信验证码" maxlength="6" type="text" v-model='data.new_mobile_captcha' @input="inputFunc"/>
          <span :class="data.new_mobile.length > 0 ? 'send' : 'noSend'" @click.stop="sendNewCaptcha" ref="newCaptcha">{{newInterval?`已发送(${newInterval})`:'发送验证码'}}</span>
        </div>
      </section>
      <div class="save" @click.stop="checkOldMobile" ref="submit">验证</div>
      <div class="right other-way" v-if="userProfile&&userProfile.enterprise_role">
        <router-link class="phone-login" :to="{ path : '/userProfile/licenseToChangePassworld' }">若无法获取原手机验证码，请点击这里<span class="rigt-arrow"></span></router-link>
      </div>
      <!-- <section v-if="!isShow"  class="CM-content">
        <div class="CM-top">
          <span  @click.stop="showCheckOldMobile">1.验证身份</span>
           <i class="ic-center"></i>
           <span class="active">2.验证新手机号</span>
        </div>
        <div class="CM-center">
          <input class=""  type="number" v-model='data.new_mobile' placeholder="请输入新手机号"/>
          <span @click.stop="sendNewCaptcha" :class="newInterval?'active':''">发送验证码{{newInterval?'('+newInterval+'s)':''}}</span>
        </div>

        <div class="CM-bottom">
          <input class="CM-input" type="number" v-model='data.new_mobile_captcha'  placeholder="请输入验证码" max="6"/>
        </div>
      </section>
      <div v-if="!isShow" class="save" @click.stop="checkNewMobile">提交</div> -->
  </div>
</template>

<script>
import vHead from 'src/components/vHead'
import { Actionsheet, Previewer, TransferDom } from 'vux';
import { mapState, mapActions } from 'vuex'
import { setUserMobile, sendMsg , captchaBoolean} from 'src/service/getData';
import { PASSWORD_REG , INT_SIX_REG, MOBILE_REG } from 'src/config/data';
export default {
  data() {
    return {
      data: {
        old_mobile_captcha: '',
        new_mobile: '',
        new_mobile_captcha: ''
      },
      isShow: true,
      oldInterval: 0,
      newInterval: 0
    }
  },
  components: { vHead },

  computed: {
    ...mapState([
      'userProfile'
    ]),
  },
  created() {
    this.$emit('edit');
  },
  mounted() {
    this.$store.dispatch('ProfileParent', false);
  },
  methods: {
    ...mapActions([
      'ProfileParent'
    ]),
    initData() {

    },
    showCheckOldMobile() {
      this.isShow = true
    },
    showCheckNewMobile() {
      this.isShow = false
    },
    sendOldCaptcha() {
      if (this.oldInterval != 0) {
        return;
      }
      sendMsg({
        account: this.userProfile.mobile,
        usage: 3
      }).then(res => {
        this.$refs.oldCaptcha.style.background = '#B2D6FF'
        this.oldInterval = 60;
        let timer1 = setInterval(() => {
          this.oldInterval = this.oldInterval - 1;
          if (this.oldInterval == 0) {
            clearInterval(timer1)
            this.$refs.oldCaptcha.style.background = '#0077FF'
          }
        }, 1000)
      }).catch(e => {
        this.$vux.toast.text(e.msg);
      })
    },
    checkOldMobile() {
      if (!INT_SIX_REG.test(+this.data.old_mobile_captcha)) {
        this.$vux.toast.text('请输入旧手机正确的验证码', 'middle');
        return ;
      }
      if (!MOBILE_REG.test(this.data.new_mobile)) {
        this.$vux.toast.text('请输入正确新手机号码', 'middle');
        return ;
      }
      if (!INT_SIX_REG.test(+this.data.new_mobile_captcha)) {
        this.$vux.toast.text('请输入新手机正确的验证码', 'middle');
        return ;
      }
      // 显示
      this.$vux.loading.show({
        text: 'Loading'
      })
      captchaBoolean({
        mobile: this.userProfile.mobile,
        captcha: this.data.old_mobile_captcha
      }).then(res=>{
        // 隐藏
        // this.$vux.loading.hide()
        // this.$vux.toast.show({
        //   text: '请验证新手机号',
        //   type: 'text',
        //   width: '33%',
        //   time: 500
        // });
        this.checkNewMobile()
      }).catch(err=>{
        // 隐藏
        this.$vux.toast.text(`原手机号码${err.msg}`, 'middle');
        this.$vux.loading.hide()
      })
    },
    sendNewCaptcha() {
      if (this.newInterval != 0) {
        return;
      }
      if (!MOBILE_REG.test(this.data.new_mobile)) {
        this.$vux.toast.text('请输入正确的手机号', 'middle');
        return;
      }
  
      sendMsg({
        account: this.data.new_mobile,
        usage: 3
      }).then(res => {
        this.$refs.newCaptcha.style.background = '#B2D6FF'
        this.newInterval = 60;
          let timer2 = setInterval(() => {
            this.newInterval = this.newInterval - 1;
            if (this.newInterval == 0) {
              clearInterval(timer2)
              this.$refs.oldCaptcha.style.background = '#0077FF'
            }
          }, 1000)
        }).catch(e => {
        this.$vux.toast.text(e.msg);
      })
    },
    checkNewMobile() {
      // if (!INT_SIX_REG.test(this.data.old_mobile_captcha)) {
      //   this.$vux.toast.text('请输入正确的验证码', 'middle');
      //   return;
      // }
      if (!MOBILE_REG.test(this.data.new_mobile)) {
        this.$vux.toast.text('请输入正确的手机号', 'middle');
        return;
      }
      if (!INT_SIX_REG.test(+this.data.new_mobile_captcha)) {
        this.$vux.toast.text('请输入正确的验证码', 'middle');
        return;
      }
      // 显示
      this.$vux.loading.show({
        text: 'Loading'
      })
      setUserMobile(this.data).then(res => {
        this.$vux.loading.hide()
        this.$emit('edit');
        // console.log(123)
        this.$router.go(-1);
        this.$vux.toast.show({
          text: '成功',
          type: "success",
          time: 500
        })

      }).catch(err => {
        // 隐藏
        this.$vux.toast.text(`新手机号码${err.msg}`, 'middle');
        this.$vux.loading.hide()
      })
    },
    inputFunc () {
      if (this.data.new_mobile.length > 0 && this.newInterval === 0) this.$refs.newCaptcha.style.background = '#0077FF'
      if (this.data.new_mobile.length > 0 && this.data.old_mobile_captcha.length > 0 && this.data.new_mobile_captcha.length > 0) this.$refs.submit.style.background = '#0077FF'
    }
  }

}

</script>
<style lang="scss" scoped>
@import "../../../style/mixin";

@mixin angle($width, $bw, $color, $direction, $right:0) {
  position: relative;
  &::after {
    content: " ";
    display: inline-block;
    height: $width;
    width: $width;
    border: $bw solid $color;
    border-color: $color $color transparent transparent; // -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    // transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    transform: rotate($direction) translateY(-50%);
    position: absolute;
    top: 50%;
    right: $right;
  }
}

.change-mobile-wrap {
  @include allcover;
  z-index: 100;
  background-color: $bgc;
  @include wh(100%, 100%);
}
.CM-OriginalPhone {
  padding: .5rem .26rem .22rem .26rem;
  > p {
    font-size: .32rem;
    color: #282A2A;
    letter-spacing: 0;
    line-height: .32rem;
    font-weight: bold;
  } 
}

.change-mobile-wrap {
  .CM-content {
    background: #fff;
    display: flex;
    flex-direction: column;
    .CM-top {
      display: flex;
      align-items: center; // background:#fff;
      @include wh(100%, 0.9rem);
      @include bb-1px(#ddd);
      span {
        flex: 1;
        text-align: center;
        &.active {
          color: $mainColor;
        }
      }
      i.ic-center {
        @include wh(1rem, 100%);
        @include angle(0.10rem, 1px, #888, 45deg, 50%);
      }
    }
    .CM-center {
      margin-left: 0.28rem;
      display: flex;
      align-items: center;
      // @include bb-1px(#ddd);
      @include wh(auto, 0.9rem);
      input {
        @include wh(4.8rem, 100%);
        font-size: .32rem;
      }
      span {
        display: inline-block;
        // background-color: $mainColor;
        border-radius: 2px;
        width: 2rem;
        text-align: center;
        padding: .2rem .3rem;
        color: white;
        margin-left: .2rem;
        &.active {
          opacity: 0.6;
          background: #fafafa;
        }
      }
    }
    .CM-bottom {
      // @include bb-1px(#ddd);
      padding: 0rem 0.24rem;
      &:last-child {
        @include bb-1px(transparent);
      }
      .CM-input {
        border-bottom: 1px solid #E8E8E8;
        @include wh(100%, 1.02rem);
        background: #fff;
        font-size: .32rem;
      }
    }
  }
  .save {
    width: 7rem;
    height: 0.88rem;
    line-height: 0.88rem;
    margin: 0.8rem auto 0;
    border-radius: 0.06rem;
    text-align: center;
    @include sc(0.32rem, #fff);
    background-color: $noEnter;
  }
}
.pt-41 {
  padding-top: .82rem;
}
.noSend {
  background: $noEnter;
}
.send {
  background: $mainColor;
}
.other-way {
  font-size: .28rem;
  color: #666666;
  letter-spacing: 0;
  line-height: .28rem;
  padding: .3rem .27rem;
}
.bor-b {
  border-bottom: 1px solid  #E8E8E8;
  // font-size: .32rem;
}
.rigt-arrow {
  @include bg-image( '../../../images/ic_more_blue_three_three');
  display: inline-block;
  width: .2rem;
  height: .2rem;
  position: relative;
  margin-left: .104rem;
}
.phone-login{
  color: #666666;
}
</style>


