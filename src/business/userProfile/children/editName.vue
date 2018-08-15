<template lang="html">
  <div class="edit-name-wrap">
      <v-head go-back="true">
        <div slot="center-part">修改姓名</div>
      </v-head>
      <section class="EN-content">
        <div class="EN-area">
          <span class="tit">姓名</span>
          <input class="EN-name" type="text" v-model='name' placeholder="请输入姓名" maxlength='32'/>
          <span class="ic-clear-wrap"  @click.stop="clear"><icon v-if="name" class="ic-clear" type="clear"></icon></span>
        </div>
      </section>
      <div class="save" @click.stop="save">保存</div>
  </div>
</template>

<script>
import vHead from 'src/components/vHead'
import { mapState , mapActions } from 'vuex'
import { setUserName } from 'src/service/getData';
import { WORLD_HTML_REG, COMPANY_REG, MOBILE_REG, EMAIL_REG } from 'src/config/data';
import { Icon } from 'vux'
export default {
  data() {
    return {
      name:''
    }
  },
  components: { vHead , Icon},

  computed:{
    ...mapState([
      'userProfile'
    ]),
  },
  created() {
    this.name=this.$route.query.name
  },
  mounted() {

  },
  methods: {
    initData(){

    },
    clear(){
      this.name=""
    },
    save(){
      if(!COMPANY_REG.test(this.name)){
        this.$vux.toast.text('请输入姓名', 'middle');
        return ;
      }
      setUserName(this.name).then(res=>{
        this.$emit('edit')
        this.$router.go(-1)
      })
    }
  }

}

</script>
<style lang="scss" scoped>
@import "../../../style/mixin";
.edit-name-wrap {
  @include allcover;
  z-index: 100;
  background-color: $bgc;
  @include wh(100%, 100%);
}
.edit-name-wrap{
  .EN-content{
    padding-top:0.2rem;
    .EN-area{
      background: #fff;
      @include wh(100%, 0.9rem);
      @include sc(0.26rem, $fontColor);
      display: flex;
      align-items: center;
      .tit{
        margin-left:0.28rem;
      }
      input.EN-name{
        flex:1;
        margin:0 0.6rem 0 0.8rem;
        height: 0.9rem;
        font-size: 0.28rem;
      }
      .ic-clear{
        font-size:0.16rem;
        margin-right:0.28rem;
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


