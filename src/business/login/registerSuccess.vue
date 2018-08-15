<template lang="html">
  <div class="wraper">
    <v-head isFixed="true" goBack="true">
      <div slot="center-part">注册成功</div>
    </v-head>
    <div>
      <div class="success"></div>
      <div class="text">注册成功</div>
    </div>
    <router-link to="/home" class="btn">到首页找场地</router-link>
  </div>
</template>

<script>
  import vHead from 'com/vHead';
export default {
  data () {
    return {

    }
  },
  components : { vHead },
}

</script>

<style lang="scss" scoped>
  @import "../../style/mixin";
  .wraper{
    @include allcover ;
    background-color: #fff;
  }
  .success{
    width: 1.32rem;
    height: 1.32rem;
    margin: 0.84rem auto 0.28rem;
    @include bg-image('../../images/ic_success');
  }
  .text{
    font-family: PingFangSC-Medium;
    @include sc(0.4rem,$fontColor);
    text-align: center;
  }
  .btn{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.16rem;
    height: 0.86rem;
    margin: 0.8rem auto 0;
    @include sc(0.3rem,#fff);
    background-color: $mainColor;
    border-radius: 0.08rem;
  }
</style>
