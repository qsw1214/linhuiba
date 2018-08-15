<template lang="html">
  <div class="account-bound-wrap">
      <v-head go-back="true">
        <div slot="center-part">第三方账号</div>
      </v-head>
      <section class="AB-content">
        <tips><div slot="text">绑定第三方账号可用其直接登录邻汇吧账号</div></tips>
        <div class="AB-item">
          <i class="ic-wechat"></i>
          <span class="tit">微信账号</span>
          <span @click.stop="unbindWechat" v-if="userProfile&&userProfile.wechat_bound" class="action active">解除绑定</span>
          <span @click.stop="bindWechat" v-else class="action">绑定微信</span>
        </div>
      </section>

  </div>
</template>

<script>
import vHead from 'src/components/vHead'
import tips from 'src/components/tips'
import { mapState, mapActions } from 'vuex'
import { unbindWechat, bindWechat } from 'src/service/getData';
import { WORLD_HTML_REG, WORLD_REG, MOBILE_REG, EMAIL_REG , APPID_LOGIN} from 'src/config/data';

import { Icon } from 'vux'
export default {
  data() {
    return {

    }
  },
  components: { vHead, Icon , tips },

  computed: {
    ...mapState([
      'userProfile'
    ]),
  },
  created() {
    this.name = this.$route.params.name
  },
  mounted() {
    this.$store.dispatch('ProfileParent', false);
    let code = this.getQueryString('code');
    if( code ){
      bindWechat( code ).then(res => {
        this.$vux.toast.show({
          type : 'success',
          text : res.msg
        });
        this.$emit('edit');
        let temp = window.location.origin + '/#/userProfile' ;
        window.location.href = temp ;
      }).catch(err => {
        this.$vux.toast.text(err.msg);
      })
    }
  },
  methods: {
    getQueryString(name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
      let r = window.location.search.substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return null;
    },
    unbindWechat(){
      unbindWechat().then( res=>{
        this.$vux.toast.text(res.msg);
        this.$emit('edit');
        let temp = window.location.origin + '/#/userProfile' ;
        window.location.href = temp ;
      }).catch(err => {
        this.$vux.toast.text(err.msg);
      })
    },
    bindWechat() {
      let appId = APPID_LOGIN(); // appid
      // 检测链接，保证在授权之前没有被code污染
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
  }

}

</script>
<style lang="scss" scoped>
@import "../../../style/mixin";

.account-bound-wrap {
  @include allcover;
  z-index: 100;
  background-color: $bgc;
  @include wh(100%, 100%);
}

.account-bound-wrap {
  .AB-content {
    .tip{
      margin-bottom: 0.2rem;
      @include wh(auto, 0.8rem);
      display: flex;
      align-items: center;
      justify-content: space-around;
      background: #ffe7b3;
      .icon{
        @include sc(0.4rem, #999);
        &.ic-close{
           @include sc(0.28rem, #999);
        }
      }
    }

    .AB-item {
      background: #fff;
      @include wh(auto, 0.9rem);
      display: flex;
      align-items: center;
      padding:0 0.28rem;
      .ic-wechat {
        @include bg-image('../../../images/ic_wechat_two_five');
        @include wh(0.6rem, 0.6rem);
      }
      span {
       &.tit{
        flex:1;
        margin-left:0.2rem;
       }
       &.action{
         display: flex;
         align-items: center;
         justify-content: center;
         border-radius:0.06rem;
        //  box-shadow: 0 0 0.02rem 0.02rem #ddd;
         border: 1px solid #ddd;
         overflow: hidden;
         @include wh(1.4rem, 0.54rem);
         &.active{
           color:$mainColor;
           border-color:$mainColor;
         }
       }

      }
    }
  }
}
</style>


