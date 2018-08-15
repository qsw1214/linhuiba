<template>
  <div class="edit-userName-wrap">
    <v-head go-back="true">
      <div slot="center-part">设置用户名</div>
      <div class="save-userName" slot="right-part" @click="saveName()">保存</div>
    </v-head>
    <tips><div class="tips-text" slot="text">用户名只允许设置一次，保存成功后不可更改，请认真填写</div></tips>
    <div class="userName">
      <input placeholder="请输入用户名 限字母、数字和下划线" type="text" maxlength="10" v-model="userName">
      <span @click="clear"></span>
    </div>
  </div>
</template>

<script>
import vHead from 'src/components/vHead'
import tips from 'src/components/tips'
import { mapState , mapActions } from 'vuex'
import { COMPANY_ACCOUNT } from 'src/config/data';
import { setUsersName } from 'src/service/getData';
export default {
  data () {
    return {
      userName: ''
    }
  },
  components: { vHead, tips },
  mounted() {
    this.$store.dispatch('ProfileParent', false);
  },
  methods: {
    ...mapActions([
      'ProfileParent'
    ]),
    clear () {
      this.userName = ''
    },
    saveName () {
      if (!COMPANY_ACCOUNT.test(this.userName) || this.userName.length > 10) {
        this.$vux.toast.text('请输入用户名，限字、数字和下划线，至多10位', 'middle') ;
        return;
      }
      let param = {
        username: this.userName
      }
      setUsersName(param).then(res => {
        this.$vux.toast.text('设置成功', 'middle') ;
        this.$router.go(-1);
      }).catch(e => {
        this.$vux.toast.text(e.msg, 'middle') ;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../style/mixin";


.edit-userName-wrap {
  @include allcover;
  z-index: 100;
  background-color: $bgc;
  @include wh(100%, 100%);
  .save-userName {
    float: right;
    font-size: .28rem;
    color: #282A2A;
    letter-spacing: 0;
    line-height: .28rem;
  }
  .tips-text {
    font-size: .24rem !important;
    letter-spacing: 0;
  }
  .userName {
    margin-top: .4rem;
    padding: 0 .24rem;
    background-color: white;
    width: 100%;
    > input {
      width: 90%;
      height: 1.12rem;
      font-size: .32rem;
    }
    > span {
      @include bg-image( '../../../images/ic_close_blue_two');
      display: inline-block;
      width: .35rem;
      height: .3rem;
      position: relative;
      top: .05rem;
    }
  }
}


</style>

