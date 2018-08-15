<template>
  <div class="company-certificate">
    <div v-show="!haveInfo">
      <div class="enterprise-more">
        <p class="more">新版企业认证已经上线，立即完成企业认证即可申请场地发布权限，更多企业服务敬请期待...</p>
        <router-link to="/appLicenseExample" class="watch-cases">查看案例<span></span></router-link>
      </div>
      <div class="enterprise-upload">
        <!-- <div class="upload" @click="select"></div> -->
        <vUploadImg ref="upload" name="img1234567" fileType="cert" class="profile-avatar-upload" max=1 :picArr="pic_url"></vUploadImg>
      </div>
      <div class="upload-comment">
        <p>1. 图片支持.jpg/.jpeg/.png 格式，大小不得超过8M。</p>
        <p>2. 请上传营业执照副本，照片需完整、清晰可见，内容真实有效。</p>
        <p>3. 如遇问题，可拨打客服热线<span @click="telUs('4001028028')">400-1028-028</span>(09:00-18:00)。</p>
      </div>
    </div>
    <div v-show="haveInfo">
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
        <p>如遇问题，可拨打客服热线<span @click="telUs('4001028028')">400-1028-028</span>(09:00-18:00)。</p>
      </div>
    </div>
    <div class="login-submit"  @click="havePhoto" ref="submit">
        提交
    </div>
  </div>
</template>

<script>
import vUploadImg from 'src/components/vUploadImgTwo';
import { base64, md5 } from 'vux'
// import { mapState, mapActions } from 'vuex'
import { licenceIdentify, enterpriseCertification } from 'src/service/getData'
import { setupWebViewJavascriptBridge } from 'src/config/tools';
import { EMSGSIZE } from 'constants';
export default {
  data () {
    return {
      pic_url: [],
      companyInfo: {},
      haveInfo: false
    }
  },
  watch: {
    pic_url (val, old) {
      this.successUpload()
    }
  },
  components: { vUploadImg },
  mounted () {
  },
  // computed: {
  //   ...mapState([
  //     'userProfile'
  //   ]),
  // },
  // async created() {
  //   await this.initData()
  // },
  methods: {
    // ...mapActions([
    //   'getUserProfile'
    // ]),
    //  async initData() {
    //   this.$vux.loading.show({ text: 'loading...' });
    //   await this.$store.dispatch('getUserProfile');
    //   this.$vux.loading.hide();
    // },
    select(){
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
          user_id: this.$route.query.user_id
        }
        licenceIdentify(parms).then(res => {
          if (res.code === 1) {
            if (res.status === 2) {
              this.$vux.toast.text('该营业执照已认证，不能重复认证', 'middle');
              return
            }
            if (res.result.status === 0) {
              this.$vux.toast.text('营业执照认证失败请重新上传', 'middle');
              return
            }
            this.$vux.toast.text('识别成功', 'middle');
            this.companyInfo = res.result
            this.haveInfo = !this.haveInfo 
            this.$refs.submit.style.background = "#0077FF"
          }
          // this.$vux.toast.text('营业执照识别失败，请确保照片内容清晰完整', 'middle');
        }).catch(e => {
          if(e.msg) {
            this.$vux.toast.text(e.msg, 'middle');
          }
        })
      } else {
        this.$vux.toast.text('请先上传', 'middle');
      }
    },
    returnBack () {
      this.$refs.submit.style.background = "#B2D6FF"
      this.pic_url = []
      this.haveInfo = !this.haveInfo 
    },
    havePhoto() {
      if (this.companyInfo.reg_num) {
        let regNum = {
          registration_no: this.companyInfo.reg_num 
        }
        enterpriseCertification(regNum).then(res => {
          this.$vux.toast.text('企业认证成功', 'middle');
          this.successCompanyCert()
        }).catch(e => {
          this.$vux.toast.text(e.msg, 'middle');
        })
      } else {
        this.$vux.toast.text('当前营业执照未上传或识别未成功', 'middle');
      }
    },
    successCompanyCert () {
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('enterpriseCertificateSuccess', '认证成功', function (data) {}) ;
      })
    },
    telUs(tel){
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('telUs', tel , function (data) {}) ;
      });
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/mixin";
.company-certificate{
    padding-bottom: 0.5rem;
    background-color: #fff;
    height: 100%;
  }
.enterprise-more {
    padding: .34rem .26rem 0.46rem .26rem;
    .more {
      margin-bottom: .2rem;
      font-size: .36rem;
      color: #282A2A;
      letter-spacing: 0;
      line-height: .52rem;
      font-weight: bold;
    }
    .watch-cases {
      font-size: .26rem;
      color: $mainColor;
      letter-spacing: 0;
      line-height: .26rem;
      > span {
        @include bg-image( '../../images/ic_chakan_three_three');
        display: inline-block;
        width: .2rem;
        height: .2rem;
        position: relative;
        top: .01rem;
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
      @include bg-image( '../../images/image_yinyezhizhao_three_three');
      @include wh(3rem, 4rem);
      display: inline-block;
    }
  }
  .upload-comment {
    padding: .4rem .2rem 0 .26rem;
    > p {
      font-size: .24rem;
      color: #999999;
      letter-spacing: 0;
      line-height: .4rem;
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
  .profile-avatar-upload{
    // position: absolute;
    // visibility: hidden;
    // height:0;
    // width:0;
    // overflow: hidden;
    // z-index: -999;
  }
  .check-company {
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
    @include bg-image('../../images/bg_shenhe_three_three');
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
      font-weight: bold;
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

