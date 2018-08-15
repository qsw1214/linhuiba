<template lang="html">
  <div class="change-password-wrap">
      <v-head go-back="true">
        <div slot="center-part">修改密码</div>
      </v-head>
      <section class="CP-content">
        <div class="CP-item"><input class="CP-input" type="password" v-model='data.old_password' placeholder="请输入当前密码" max="30"/></div>
        <div class="CP-item"><input class="CP-input" type="password" v-model='data.password' placeholder="请输入新密码（6-30位字母数字）" max="30"/></div>
        <div class="CP-item"><input class="CP-input" type="password" v-model='data.password_confirmation' placeholder="请确认新密码" max="30"/></div>
      </section>
      <div class="save" @click.stop="save">保存</div>
  </div>
</template>

<script>
import vHead from 'src/components/vHead'
import { mapState } from 'vuex'
import { setUserPassword } from 'src/service/getData';
import { PASSWORD_REG } from 'src/config/data';
export default {
  data() {
    return {
      data:{
        old_password: '',
        password: '',
        password_confirmation: ''
      }
    }
  },
  components: { vHead },

  computed:{
    ...mapState([
      'userProfile'
    ]),
  },
  created() {
  },
  mounted() {

  },
  methods: {
    initData(){

    },
    check(){
      let { old_password, password, password_confirmation} = this.data;
      if (!PASSWORD_REG.test(old_password)) {
        this.$vux.toast.text('请输入正确的密码', 'middle');
        return false;
      }
      if (!PASSWORD_REG.test(password)) {
        this.$vux.toast.text('请输入新密码', 'middle');
        return false;
      }
      if (!PASSWORD_REG.test(password_confirmation)) {
        this.$vux.toast.text('请再次输入新密码', 'middle');
        return false;
      }
      if (password_confirmation!= password) {
        this.$vux.toast.text('请确认新密码', 'middle');
        return false;
      }
      return true;
    },
    save(){
      if(!this.check()){
        return;
      }
      setUserPassword(this.data).then(res=>{
        this.$router.go(-1);
        this.$vux.toast.show({
          text: '成功',
          type: "success",
          time: 500
        });
        return false ;
      })
    }
  }

}

</script>
<style lang="scss" scoped>
@import "../../../style/mixin";
// @mixin iconClear($size:0.16rem,$color:#000){
//   position: relative;
//   &::after{
//     position: absolute;
//     content: "\EA0F";
//     display: inline-block;
//     font-size: 0.16rem;
//     color:$color;
//   }
// }
.change-password-wrap {
  @include allcover;
  z-index: 100;
  background-color: $bgc;
  @include wh(100%, 100%);
}
.change-password-wrap{
  .CP-content{
    margin-top:0.2rem;
    // background: #fff;
    display: flex;
    flex-direction: column;
    .CP-item{
      @include bb-1px(#ddd);
      &:last-child{
         @include bb-1px(transparent);
      }
      .CP-input{
        @include wh(100%, 0.9rem);
        padding:0.15rem 0.24rem;
        background:#fff;
        font-size:0.26rem;

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
  background-color: $mainColor;
}

}


</style>


