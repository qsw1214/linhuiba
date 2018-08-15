<template  lang="html">
  <div class="license-passworld">
    <v-head go-back="true">
      <div slot="center-part">修改手机号码</div>
    </v-head>
    <section class="CM-content">
      <div class="CM-bottom">
        <input class="CM-input" type="number" v-model.trim="newPhone"  placeholder="请输入新手机号码" max="6"/>
      </div>
      <div class="CM-center">
        <input class="" placeholder="请输入短信验证码" type="number" v-model.trim="captcha"  max="6" />
        <span :class="newPhone? 'active' : 'send'" @click.stop="sendOldCaptcha" ref="oldCaptcha">{{oldInterval?`已发送(${oldInterval})`:'发送验证码'}}</span>
      </div>
    </section>
    <div class="uoload-top" v-show="!isUpload">
      <p class="upload-tip">请上传您的营业执照副本！</p>
      <router-link to="/licenseExample" class="upload-example">查看案例<span></span></router-link>
    </div>
    <div class="enterprise-upload" v-show="!isUpload">
      <!-- <div class="upload" @click="select"></div> -->
      <vUploadImg ref="upload" name="img123456" fileType="cert" class="profile-avatar-upload" max=1 :picArr="pic_url"></vUploadImg>
    </div>

    <div v-show="isUpload">
      <div class="check-company">
        <p>请核对企业信息</p>
      </div>
      <div class="info-photo">
        <div class="company-info">
          <p>信用代码：{{companyInfo.reg_num ? companyInfo.reg_num : ''}}</p>
          <p>企业名称：{{companyInfo.name ? companyInfo.name : ''}}</p>
          <!-- <p>法人代表：{{companyInfo.person ? companyInfo.person : ''}}</p> -->
          <p>所在省市：{{companyInfo.city ? companyInfo.city : ''}}</p>
          <p>详细地址：{{companyInfo.address ? companyInfo.address : ''}}</p>
        </div>
      </div>
      <div class="check-info">
        <p>信息若有误，可<span @click="returnBack">重新上传</span></p>
      </div>
      <div class="call-phone">
        <p>如遇问题，可拨打客服热线<a href="tel:400-1028-028">400-1028-028</a>(09:00-18:00)。</p>
      </div>
    </div>


    <div class="upload-comment"  v-show="!isUpload">
      <p>1. 图片支持.jpg/.jpeg/.png 格式，大小不得超过8M。</p>
      <p>2. 请确认营业执照完整性，信息清晰可见，内容真实有效；如遇问题，可咨询客服热线400-1028-028(09:00-18:00)。</p>
    </div>
    <div class="submit" @click="changeMobile">
      提交
    </div>
  </div>
</template>

<script>
import vHead from 'src/components/vHead'
import vUploadImg from 'src/components/vUploadImgTwo';
import { mapGetters, mapActions, mapState } from 'vuex';
import { MOBILE_REG, INT_SIX_REG } from 'src/config/data';
import { licenceIdentify, sendMsg, lisetenToChangeMobile, captchaBoolean } from 'src/service/getData'
import { base64, md5 } from 'vux'
  export default {
    data () {
      return {
        msg: 'aa',
        oldInterval: 0,
        newPhone: '',
        captcha: '',
        isUpload: false,
        pic_url: [],
        companyInfo: {}
      }
    },
    components: {
      vHead,
      vUploadImg
    },
    watch: {
      pic_url: function (value, oldValue) {
        console.log(1)
        this.successUpload()
      }
    },
    computed: {
      ...mapGetters({
        imgUrl: 'GET_LICENSEURL'
      }), 
      ...mapState([
        'userProfile'
      ]),
    },
    created() {
      this.initData()
    },
    mounted () {
      this.$store.dispatch('ProfileParent', false);
    },
    methods: {
      ...mapActions([
        'ProfileParent',
        'getUserProfile'
      ]),
      async initData() {
        this.$vux.loading.show({ text: 'loading...' });
        await this.$store.dispatch('getUserProfile');
        this.$vux.loading.hide();
      },
      sendOldCaptcha () {
        if (this.oldInterval != 0) {
          return;
        }
        sendMsg({
          account: this.newPhone,
          usage: 3
        }).then(res => {
          this.$refs.oldCaptcha.style.background = '#B2D6FF'
          this.$vux.toast.text('验证码发送成功' , 'middle');
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
      select() {
        this.$refs.upload.changeImg()
      },
      successUpload () {
        if (this.pic_url[0]) {
          var timestamp = (Date.parse(new Date())) / 1000;
          var str = base64.encode(`link=${this.pic_url[0]}&timestamp=${timestamp}&secret_key=aae31309a29d0643ef968ce75d2d0404`)
          // var signature  = md5('The quick brown fox jumps over the lazy dog', 'utf8')
          var signature = md5(str)
          let parms = {
            link: this.pic_url[0],
            timestamp: timestamp,
            signature: signature,
            user_id: this.userProfile.id
          }
          licenceIdentify(parms).then(res => {
            if (res.code === 1) {
              this.$vux.toast.text('识别成功', 'middle');
              this.isUpload = !this.isUpload
              this.companyInfo = res.result
              this.showTap = 3
              this.$refs.submit.style.background = "#0077FF"
              console.log(this.companyInfo)
            } else {
              this.$vux.toast.text('营业执照识别失败，请确保照片内容清晰完整', 'middle');
            }
          }).catch(e => {
            if(e.msg) {
              this.$vux.toast.text(e.msg, 'middle');
            }
          })
        } else {
          this.$vux.toast.text('当前营业执照未上传或识别未成功', 'middle');
        }
      },
      returnBack () {
        this.companyInfo = {}
        this.isUpload = false
      },
      changeMobile () {
        let mobile = this.newPhone
        let captcha = this.captcha
        let reg_num = this.companyInfo.reg_num
        if ( !MOBILE_REG.test(mobile) ){
          this.$vux.toast.text('请输入11位有效手机号或者账号', 'middle');
          return ;
        }
        if( !INT_SIX_REG.test( captcha ) ){
          this.$vux.toast.text('请输入4-6位有效的数字验证码', 'middle') ;
          return ;
        }
        if (!reg_num) {
          this.$vux.toast.text('营业执照未上传或识别错误', 'middle') ;
          return ;
        }
        let parm = {
          mobile: mobile,
          captcha: captcha
        }
        captchaBoolean({mobile, captcha}).then(res => {
          let parms = {
            mobile: mobile,
            captcha: captcha,
            registration_no: this.companyInfo.reg_num
          }
          console.log(parms)
          lisetenToChangeMobile(parms).then(res => {
            this.$vux.toast.text('修改成功', 'middle');
            this.$router.go(-2);
          }).catch(e => {
            this.$vux.toast.text(e.msg, 'middle');
          })
        }).catch(e => {
           this.$vux.toast.text(e.msg, 'middle');
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
@import "../../../style/mixin";
.license-passworld {
  @include allcover;
  z-index: 100;
  background-color: #fff;
  @include wh(100%, 100%);
}
.license-passworld {
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
        // @include angle(0.10rem, 1px, #888, 45deg, 50%);
      }
    }
    .CM-center {
      margin-left: 0.28rem;
      display: flex;
      align-items: center;
      // @include bb-1px(#ddd);
      @include wh(auto, 0.9rem);
      input {
        @include wh(5rem, 100%);
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
        &.active {
          // opacity: 0.6;
          // background: #fafafa;
          background: #0077FF;
        }
      }
    }
    .CM-bottom {
      
      padding:  0 .24rem;
      &:last-child {
        @include bb-1px(transparent);
      }
      .CM-input {
        border-bottom: 1px solid #E8E8E8;
        @include wh(100%, 1.02rem);
        padding: .15rem 0;
        background: #fff;
        font-size: .32rem;
      }
    }
  }
}
.send {
  background: $noEnter;
}


.uoload-top {
  border-top: .22rem solid #f8f8f8;
  background-color: #fff;
  padding: .4rem .26rem;
  .upload-tip {
    font-size: .36rem;
    color: #282A2A;
    letter-spacing: 0;
    line-height: .36rem;
    padding-bottom: .3rem;
    font-weight: bold;
  }
  .upload-example {
    font-size: .26rem;
    color: #0077FF;
    letter-spacing: 0;
    line-height: .26rem;
    > span {
      @include bg-image( '../../../images/ic_chakan_three_three');
      display: inline-block;
      width: .2rem;
      height: .2rem;
      margin-left: .104rem;
    }
  }
}
  .enterprise-upload {
    background-color: #f8f8f8;
    width: 100%;
    text-align: center;
    padding: .4rem 0 .38rem 0;
    .upload {
      @include bg-image( '../../../images/image_yinyezhizhao_three_three');
      @include wh(3rem, 4rem);
      display: inline-block;
    }
  }
  .upload-comment {
    padding: .4rem .2rem 2rem .26rem;
    background: white;
    > p {
      font-size: .24rem;
      color: #999999;
      letter-spacing: 0;
      line-height: .4rem;
    }
  }
  .profile-avatar-upload{
    // position: absolute;
    // height:0;
    // width:0;
    // overflow: hidden;
    // z-index: -999;
    // visibility: hidden;
  }
  .submit {
    margin-top: .7rem;
    position: fixed;
    bottom: 0;
    background: #0077FF;
    border-radius: 2px;
    width: 100%;
    font-size: .34rem;
    color: #FFFFFF;
    letter-spacing: 0;
    line-height: .34rem;
    padding: .32rem 0;
    text-align: center;
  }

  .check-company {
    border-top: .22rem solid #f8f8f8;
    padding: .4rem .26rem .42rem .26rem;
    > p {
      font-size: .36rem;
      color: #282A2A;
      letter-spacing: 0;
      line-height: .36rem;
      font-weight: bold;
    }
  }
  .info-photo {
    @include bg-image('../../../images/bg_shenhe_three_three');
    @include wh(100%, 4.24rem);
    .company-info {
      padding: .46rem .26rem .44rem .26rem;
      > p {
        font-size: .3rem;
        padding-bottom: .3rem;
        color: #FFFFFF;
        letter-spacing: 0;
        line-height: .3rem;
      }
    }
  }
  .check-info {
    padding: .4rem .26rem .3rem .26rem;
    > p {
      font-size: .32rem;
      color: #000000;
      letter-spacing: 0;
      line-height: .32rem;
      > span {
        color: $mainColor;
      }
    }
  }
  .call-phone {
    padding: 0 .26rem;
    > p {
      font-size: .24rem;
      color: #999999;
      letter-spacing: 0;
      line-height: .24rem;
      > a {
        color: $mainColor
      }
    }
  }
</style>

