<template lang="html">
  <div class="register-wraper">
    <v-head path="/login">
      <div slot="center-part" class="register">{{title}}</div>
    </v-head>
    <tab :custom-bar-width="getBarWidth" bar-active-color="#0077FF">
      <tab-item active-class="tab-checked" selected @on-item-click="onItemClick(1)">企业账号</tab-item>
      <tab-item active-class="tab-checked" @on-item-click="onItemClick(2)">个人账号</tab-item>
    </tab>
    <div v-show="showTap === 2">
      <form action="javascript:;" class="register-model">
        <label class="register-com border-1px">
          <!-- <span class="add-pre">+86</span> -->
          <input type="number" placeholder="请输入手机号" autocomplete="off" class="mobile" v-model.trim="account" @input ="inputFunc">
        </label>
        <div class="register-com border-1px">
          <label class="reg-lt">
            <!-- <span class="com-left">验证码</span> -->
            <input type="text" placeholder="请输入短信验证码" autocomplete="off" class="identifying" v-model.trim="captcha" @input ="inputFunc">
          </label>
          <div class="get-identifying" :class="{ active : account }" ref="smss">
            <span v-if="!interval"  @click="getIdentifying(1)">获取验证码</span>
            <span v-else="interval" class="send">已发送( {{ interval }} )</span>
          </div>
        </div>

        <label class="register-com border-1px p-51">
          <!-- <span class="com-left">密码</span> -->
          <input
          type="password"
          placeholder="请输入密码（至少6位）"
          class="password"
          autocomplete="off"
          v-model.trim="password"
          @input ="inputFunc">
        </label>
        <label class="register-com border-1px p-51">
          <!-- <span class="com-left">确认密码</span> -->
          <input
          type="password"
          placeholder="请确认密码"
          class="confirm-password"
          autocomplete="off"
          v-model.trim="confirmPassword"
          @input ="inputFunc">
        </label>
        <label class="register-com border-1px p-51">
          <!-- <span class="com-left">邀请码</span> -->
          <input
          type="text"
          placeholder="请输入推荐人的邀请码（选填）"
          class="invite-code"
          autocomplete="off"
          v-model.trim="invite_code">
        </label>
      </form>
      <div class="register-submit" :class="{ disabled : !is_agree }" @click="postRegister" ref="personSubmit">
        注册
      </div>
      <div class="agreement">
        <input type="checkbox" v-model="is_agree">
        <span>我已阅读并同意<router-link to="/appRegisterProtocol">《邻汇吧用户注册协议》</router-link></span>
      </div>
    </div>
    <div v-show="showTap === 1">
      <div class="enterprise-more">
        <p class="more">完成企业注册，即可申请场地发布权限，更多企业服务敬请期待...</p>
        <router-link to="/licenseExample" class="watch-cases">查看案例<span></span></router-link>
      </div>
      <div class="enterprise-upload">
        <!-- <div class="upload" ref="bgimg" @click="select"></div> -->
        <vUploadImg ref="upload" name="img1234567" fileType="cert"  class="profile-avatar-upload" max=1 :picArr="pic_url"></vUploadImg>
      </div>
      <div class="upload-comment">
        <p>1. 图片支持.jpg/.jpeg/.png 格式，大小不得超过8M。</p>
        <p>2. 请确认营业执照完整性，信息清晰可见，内容真实有效；如遇问题，可咨询客服热线400-1028-028(09:00-18:00)。</p>
      </div>
      <div class="login-submit"  @click="havePhoto" :class="{ disabled : !is_agree }" >
        下一步，填写账号信息
      </div>
      <div class="enterprise-agreement">
        <input type="checkbox" v-model="is_agree">
        <span>我已阅读并同意<router-link to="/appRegisterProtocol">《邻汇吧用户注册协议》</router-link></span>
      </div>
    </div>

    <div v-show="showTap === 3">
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
      <div class="login-submit" ref="submit" @click="checkCompanyInfo">
        下一步，填写账号信息
      </div>
    </div>
    
    <div v-show="showTap === 4">
      <form action="javascript:;" class="register-model">
        <label class="register-com border-1px">
          <!-- <span class="add-pre">+86</span> -->
          <input type="text" placeholder="请输入用户名，限字、数字和下划线，至多10位" maxlength="10" autocomplete="off" class="mobile" v-model.trim="companyAccount" @input="inputFunc" >
        </label>
        <label class="register-com border-1px p-51">
          <!-- <span class="com-left">密码</span> -->
          <input
          type="password"
          placeholder="请输入密码（至少6位）"
          class="password"
          autocomplete="off"
          v-model.trim="companyPassword"
          @input="inputFunc">
        </label>
        <label class="register-com border-1px p-51">
          <!-- <span class="com-left">确认密码</span> -->
          <input
          type="password"
          placeholder="请确认密码"
          class="confirm-password"
          autocomplete="off"
          v-model.trim="companyConfirmPassword"
          @input="inputFunc">
        </label>
        <label class="register-com border-1px">
          <!-- <span class="add-pre">+86</span> -->
          <input type="number" placeholder="请输入手机号码" autocomplete="off" class="mobile" v-model.trim="companyPhone" @input="inputFunc">
        </label>
        <div class="register-com border-1px">
          <label class="reg-lt">
            <!-- <span class="com-left">验证码</span> -->
            <input type="number" placeholder="请输入短信验证码" autocomplete="off" class="identifying" v-model.trim="companyCaptcha" @input="inputFunc">
          </label>
          <div class="get-identifying" :class="{ active : companyPhone }" ref="sms">
            <span v-if="!interval"  @click="getIdentifying(2)">获取验证码</span>
            <span v-else="interval" class="send">已发送( {{ interval }} )</span>
          </div>
        </div>
        <label class="register-com border-1px p-51">
          <!-- <span class="com-left">邀请码</span> -->
          <input
          type="text"
          placeholder="请输入推荐人的邀请码（选填）"
          class="invite-code"
          autocomplete="off"
          v-model.trim="companyInvite_code">
        </label>
      </form>
      <div class="register-submit" :class="{ disabled : !is_agree }" @click="postCompanyRegister" ref="companySubmit">
        注册
      </div>
      <div class="agreement">
        <input type="checkbox" v-model="is_agree">
        <!-- https://www.linhuiba.com/protocal.html -->
        <span>我已阅读并同意<router-link to="/appRegisterProtocol">《邻汇吧用户注册协议》</router-link></span>
      </div>
      <!-- <actionsheet v-model="isShow" :menus="menu" theme="android" @on-click-menu="menuClick"></actionsheet> -->
    </div>
  </div>
</template>

<script>
import vHead from 'src/components/vHead' ;
import { Tab, TabItem, Actionsheet, Previewer, TransferDom} from 'vux'
import vUploadImg from 'src/components/vUploadImgTwo';
import { mapState, mapMutations } from 'vuex';
import { CAPTCHA_REG , MOBILE_REG , INT_SIX_REG , PASSWORD_REG, COMPANY_ACCOUNT } from 'src/config/data' ;
import { sendMsg , captchaBoolean , register, registeredCompanyAccount, postLogin, licenceIdentifyRegistered, userCertified } from 'src/service/getData' ;
import { base64, md5 } from 'vux'
export default {
  data (){
    return {
      account : '',
      password : '',
      confirmPassword : '' ,
      captcha : '' ,
      invite_code : '',
      interval : 0 ,
      title: '注册',
      is_agree : true,
      getBarWidth: '1.2rem',
      showTap: 1,
      pic_url: [],
      companyInfo: {},
      companyAccount: '',
      companyPassword: '',
      companyConfirmPassword: '',
      companyPhone: '',
      companyCaptcha: '',
      companyInvite_code: '',
      coverPhotoClass: {}
      // isShow: false,
      // menu: [ //图片菜单选项
      //     {
      //         label: '查看原图',
      //         type: 'primary',
      //         value: 'preview'
      //     },
      //     {
      //         label: '更换图片',
      //         type: 'warn',
      //         value: 'change'
      //     },
      //     {
      //         label: '删除图片',
      //         type: 'warn',
      //         value: 'delete'
      //     },
      // ]
    }
  },
  components : {
    vHead,
    Tab, 
    TabItem,
    vUploadImg
  },
  mounted () {
    this.coverPhotoClass = {
        backgroundImage: '' ||"url("+this.pic_url[0]+")",
        width: '3rem',
        height: '4rem',
        borderRadius: 0,
        backgroundColor: ''
      }
  },
  watch: {
    pic_url (val, oldVal) {
      // this.$refs.bgimg.style.backgroundImage ="url("+this.pic_url[0]+")"
      // console.log(this.$refs.bgimg.style)
      this.successUpload()
    }
  },
  methods : {
    ...mapMutations([
        'RECORD_USERINFO'
    ]),
    getIdentifying (type) {
      // 对电话号码做判断
      let dataMobile  ;
      if (type === 1) {
        if( !MOBILE_REG.test( this.account ) ){
          this.$vux.toast.text('手机号格式不正确', 'middle') ;
          return ;
        }
        dataMobile = this.account
      } else {
        if( !MOBILE_REG.test( this.companyPhone ) ){
          this.$vux.toast.text('手机号格式不正确', 'middle') ;
          return ;
        }
        dataMobile = this.companyPhone
      }
      // !MOBILE_REG.test( this.account )
      // if( !MOBILE_REG.test( this.account ) ){
      //   this.$vux.toast.text('请输入11位有效手机号', 'middle') ;
      //   return ;
      // }
      sendMsg( { account : dataMobile , usage : 1 } )
        .then( res => {
          this.$vux.toast.text('验证码发送成功' , 'middle');
          this.$refs.sms.style.background = '#B2D6FF';
          this.$refs.smss.style.background = '#B2D6FF';
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
    postRegister () {
      if( this.is_agree ){
        if( !MOBILE_REG.test( this.account ) ){
          this.$vux.toast.text('手机号格式不正确', 'middle') ;
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
              channel : 'wap'
            };
            if( this.invite_code ){
              params.invite_code = this.invite_code ;
            }
            register( params )
              .then( res => {
                this.$vux.toast.show({
                  text : '恭喜你，注册成功！' ,
                  type : 'success' ,
                  width : '33%'
                });
                // 返回首页
                let account = params.account
                let password = params.password
                postLogin( { account , password } )
                .then( res => {
                  this.RECORD_USERINFO( res.result );
                  if(!res.result.mobile) {
                    // 跳转到绑定手机号页面
                    this.$router.push({ path : '/bindMobile' , query : {redirect : this.$route.query.redirect } });
                  }else{
                    // this.$vux.toast.show({
                    //   text : '登录成功',
                    //   type : 'success',
                    //   width : '25%'
                    // });
                    this.$router.push( '/registerSuccess' ) ;
                    // let redirect = this.$route.query.redirect ;
                    // if(redirect) {
                    //   let temp = window.location.origin + '/#' + redirect ;
                    //   window.location.href = temp ;
                    //   // this.$router.replace( redirect ); 会存在跳转失败的情况
                    // }else {
                    //   // 避免授权的bug;
                    //   let temp2 = window.location.origin + '/#/home' ;
                    //   window.location.href = temp2 ;
                    //   // this.$router.replace({ path : '/home' });
                    // }
                  }
                })
                .catch( err => {
                  this.$vux.toast.text(err.msg);
                })
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
    },
    postCompanyRegister () {
      if( this.is_agree ){
        // if (!this.companyInfo.reg_num) {
        //   this.$vux.toast.text('请上传营业执照', 'middle') ;
        //   return;
        // }
        if (!COMPANY_ACCOUNT.test(this.companyAccount) || this.companyAccount.length > 10) {
          this.$vux.toast.text('请输入用户名，限字母、数字和下划线，至多10位', 'middle') ;
          return;
        }
        if(!PASSWORD_REG.test(this.companyPassword)) {
          this.$vux.toast.text('请输入6-30位数字字母组成的密码', 'middle') ;
          return;
        }
        if( this.companyPassword != this.companyConfirmPassword ){
            this.$vux.toast.text('你两次输入的密码不一致,请重新输入', 'middle') ;
            return ;
          }
        if( !MOBILE_REG.test( this.companyPhone ) ){
          this.$vux.toast.text('手机号格式不正确', 'middle') ;
          return ;
        }
        if( !INT_SIX_REG.test( this.companyCaptcha ) ){
            this.$vux.toast.text('请输入4-6位有效的数字验证码', 'middle') ;
            return ;
          }
        if (this.companyInvite_code ) {
          if( !CAPTCHA_REG.test( this.companyInvite_code ) ){
            this.$vux.toast.text('你输入的邀请码有误,请重新输入', 'middle') ;
            return ;
          }
        }
        let params = {
          registration_no: this.companyInfo.reg_num,
          account: this.companyAccount,
          password: this.companyPassword,
          mobile: this.companyPhone,
          captcha: this.companyCaptcha,
          channel: 'wap'
        }
        let mobile = this.companyPhone
        let captcha = this.companyCaptcha
        captchaBoolean( { mobile  , captcha  } )
          .then( res => {
            // 验证码有效
            if( this.companyInvite_code ){
              params.companyInvite_code = this.companyInvite_code ;
            }
            let username = {
              username: this.companyAccount
            }
            userCertified(username).then(res => {
              registeredCompanyAccount( params )
              .then( res => {
                this.$vux.toast.show({
                  text : '恭喜你，注册成功！' ,
                  type : 'success' ,
                  width : '33%'
                });
                let account = params.account
                let password = params.password
                // 返回首页
                 postLogin( { account , password } )
                .then( res => {
                  this.RECORD_USERINFO( res.result );
                  if(!res.result.mobile) {
                    // 跳转到绑定手机号页面
                    this.$router.push({ path : '/bindMobile' , query : {redirect : this.$route.query.redirect } });
                  }else{
                    // this.$vux.toast.show({
                    //   text : '登录成功',
                    //   type : 'success',
                    //   width : '25%'
                    // });
                    this.$router.push( '/registerSuccess' ) ;
                    // let redirect = this.$route.query.redirect ;
                    // if(redirect) {
                    //   let temp = window.location.origin + '/#' + redirect ;
                    //   window.location.href = temp ;
                    //   // this.$router.replace( redirect ); 会存在跳转失败的情况
                    // }else {
                    //   // 避免授权的bug;
                    //   let temp2 = window.location.origin + '/#/home' ;
                    //   window.location.href = temp2 ;
                    //   // this.$router.replace({ path : '/home' });
                    // }
                  }
                })
                .catch( err => {
                  this.$vux.toast.text(err.msg);
                })
                // this.$router.push( '/registerSuccess' ) ;
              })
              .catch( err => {
                this.$vux.toast.show({
                  text : err.msg ,
                  type : 'cancel' ,
                  width : '33%'
                })
              })
            }).catch(err => {
              this.$vux.toast.text(err.msg);
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
    },
    onItemClick (num) {
      if (typeof num !== 'number' || num > 2) return  new Error ('The param must be number and should be 1 or 2 ')
      if (num === 1 && this.companyInfo.reg_num) {
        num = 3
      }
      this.showTap = num
      this.title = '注册'
    },
    inputFunc () {
      if (this.account.length !== 0 && this.password.length !== 0 && this.confirmPassword.length !== 0) {
        this.$refs.personSubmit.style.background = '#0077FF'
      } else {
        this.$refs.personSubmit.style.background = '#B2D6FF'
      }
      if (this.companyAccount.length !== 0 && this.companyPassword.length !== 0 && this.companyConfirmPassword.length !== 0 && this.companyPhone.length !== 0 && this.companyCaptcha.length !== 0 ) {
        this.$refs.companySubmit.style.background = '#0077FF'
      } else {
        this.$refs.companySubmit.style.background = '#B2D6FF'
      }
    },
    select(){
      // if (this.pic_url[0]) {
      //   this.isShow = !this.isShow
      // } else {
      //   this.$refs.upload.changeImg()
      // }
      this.$refs.upload.changeImg()
    },
    successUpload () {
      if (this.pic_url[0]) {
        if (this.companyInfo.name) {
          this.showTap = 3
        } else {
          var timestamp = (Date.parse(new Date())) / 1000;
          var str = base64.encode(`link=${this.pic_url[0]}&timestamp=${timestamp}&secret_key=aae31309a29d0643ef968ce75d2d0404`)
          // var signature  = md5('The quick brown fox jumps over the lazy dog', 'utf8')
          var signature = md5(str)
          let parms = {
            link: this.pic_url[0],
            timestamp: timestamp,
            signature: signature
          }
          licenceIdentifyRegistered(parms).then(res => {
            if (res.code === 1) {
              if (res.result.status === 2) {
                this.$vux.toast.text('该企业已认证，不能重复注册', 'middle');
                return
              }
              if (res.result.status === 0) {
                this.$vux.toast.text('营业执照认证失败请重新上传', 'middle');
                return
              }
              this.$vux.toast.text('识别成功', 'middle');
              this.companyInfo = res.result
              this.title = '核对企业信息'
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
        }
      } else {
        this.$vux.toast.text('当前营业执照未上传或识别未成功', 'middle');
      }
    },
    checkCompanyInfo () {
      this.title = '注册'
      this.showTap = 4
    },
    returnBack () {
      this.pic_url = []
      this.companyInfo = []
      this.showTap = 1
    },
    havePhoto () {
      if (this.pic_url.length ===  0) this.$vux.toast.text('请先上传', 'middle');
    }
  }
}

</script>

<style lang="scss" scoped>
  @import "../../style/mixin";
  .register-wraper{
    padding-bottom: 0.5rem;
    background-color: #fff;
    height: 100%;
  }
  .reg-lt{
    .identifying{
      width: 4.9rem;
    }
  }
  .register-model {
    padding: 0 0.28rem;
    font-size: 0.28rem;
    line-height: 1.03rem;
    input {
      color : #666 ;
      font-size: .32rem;
    }
    .register-com {
      display: flex;
      @include bb-1px( #e8e8e8 );
      position: relative;
    }
    .add-pre {
      width:  1rem ;
      line-height: 0.9rem;
      color: $mainColor;
      @include br-1px( #e8e8e8 );
    }
    .mobile {
      width: 6.7rem;
      height: 1.02rem;
    }
    .confirm-password , .password , .invite-code{
      width: 5.3rem;
    }
    .com-left {
      display: inline-block;
      width: 1.34rem;
    }
    .get-identifying {
      width: 2rem;
      height: 0.68rem;
      text-align: center;
      position: relative;
      top: 0.18rem;
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
  .register-submit {
    width: 7rem;
    height: 0.88rem;
    line-height: 0.88rem;
    margin: 0.77rem auto 0;
    border-radius: 0.04rem;
    text-align: center;
    color: #fff;
    font-size: 0.32rem;
    background-color: $noEnter;
    &.disabled {
      background-color: #ccc;
    }
  }
  .disabled {
      background-color: #ccc !important;
    }
  .agreement {
    display: inline-block;
    align-items: center;
    padding: 0 0.28rem;
    width: 100%;
    text-align: center;
    height: 0.4rem;
    position: fixed;
    bottom: 0.4rem;
    line-height: 0.4rem;
    font-size: 0.24rem;
    input{
      @include wh(0.5rem,0.5rem);
      position: relative;
      top: .1rem;
      // margin-right: 0.2rem;
      @include bg-image('../../images/ic_gouxuan_nor_three_three');
      &:checked{
        @include bg-image('../../images/Group_three_three');
      }
    }
    > span {
      color: #666;
      position: relative;
      top: -.055rem;
      > a {
        color: $mainColor ;
      }
    }
  }
  .tab-checked {
    font-size: 0.28rem !important;
    color: #0077FF!important;
    border-color: #0077FF !important;
  }
  .p-51 {
    padding: .35rem 0;
  }
  input::-webkit-input-placeholder {
    font-size: .28rem;
    line-height: .28rem
  }

  .enterprise-more {
    padding: .34rem .26rem 0.46rem .26rem;
    .more {
      margin-bottom: .2rem;
      font-size: .36rem;
      color: #282A2A;
      letter-spacing: 0;
      line-height: .52rem;
      font-weight: 200;
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

   .enterprise-agreement {
    display: table;
    align-items: center;
    width: 100%;
    text-align: center;
    height: 0.4rem;
    line-height: 0.4rem;
    font-size: .24rem;
    border-top: .66rem solid white;
    border-bottom: .2rem solid white;
    background-color: white;
    input{
      @include wh(0.5rem,0.5rem);
      position: relative;
      top: .1rem;
      // margin-right: 0.2rem;
      @include bg-image('../../images/ic_gouxuan_nor_three_three');
      &:checked{
        @include bg-image('../../images/Group_three_three');
      }
    }
    > span {
      color: #666;
      position: relative;
      top: -.055rem;
      margin-left: .1rem;
      > a {
        color: $mainColor ;
      }
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
  .check-company {
    padding: .4rem .26rem .42rem .26rem;
    > p {
      font-size: .36rem;
      color: #282A2A;
      letter-spacing: 0;
      line-height: .36rem;
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
