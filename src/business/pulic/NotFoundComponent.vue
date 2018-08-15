<template lang="html">
  <div class="not-find">
    <v-head goBack="true" isFixed="true">
      <div slot="center-part">404</div>
    </v-head>
    <div class="bg-img"></div>
    <div class="ct">
     <p>很抱歉 ≥-≤</p>
     <p>没有找到你要访问的网页</p>
    </div>
    <router-link class="btn" to="/home">返回首页</router-link>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead.vue';
export default {
  data () {
    return {

    }
  },
  components : {
    vHead
  }
}

</script>

<style lang="scss" scoped>
  @import "../../style/mixin";
  .not-find{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    .bg-img{
      @include wh(2.8rem,2.8rem);
      margin: 0.5rem auto;
      @include bg-image('../../images/image_404error');
    }
    .ct{
      line-height: 0.54rem;
      @include sc(0.3rem,#999)
    }
    .btn{
      display: block;
      @include wh(2.42rem,0.72rem);
      margin: 0.4rem auto;
      text-align: center;
      line-height: 0.7rem;
      border: 1px solid $mainColor;
      border-radius: 0.36rem;
      color: $mainColor;
    }
  }
</style>
