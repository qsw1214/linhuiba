<template lang="html">
  <div class="enquire-wraper">
    <v-head goBack="true">
      <div slot="center-part">提交成功</div>
    </v-head>
    <div class="content">
      <div class="bg-img"></div>
      <div class="bold">询价单提交成功</div>
      <div class="info">工作人员正在为您处理，请留意短信通知</div>
    </div>
    <div class="btns">
      <router-link to="/home" class="back-home">返回首页</router-link>
      <router-link :to="{ name : 'enquireDetail' , params : { id : id } }" class="view-enquire">查看询价单</router-link>
    </div>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead';
export default {
  data () {
    return {
      id : this.$route.query.id
    }
  },
  components: { vHead },
}

</script>

<style lang="scss" scoped>
  @import "../../style/mixin";
  .enquire-wraper{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
  }
  .content{
    padding: 0.44rem 0 0.5rem;
    .bg-img{
      @include wh(2.02rem,2.02rem);
      margin: 0 auto;
      @include bg-image('../../images/ic_Submit_successfully');
    }
    .bold{
      margin-top: 0.2rem;
      text-align: center;
      font-size: 0.36rem;
    }
    .info{
      margin-top: 0.3rem;
      text-align: center;
      @include sc(0.26rem,#a9a9a9);
    }
  }
  .btns{
    display: flex;
    justify-content: space-between;
    padding: 0 1.2rem;
    .back-home{
      @include wh(2.36rem,0.64rem);
      line-height: 0.64rem;
      text-align: center;
      border: 1px solid #999;
      border-radius: 0.08rem;
    }
    .view-enquire{
      @include wh(2.36rem,0.64rem);
      line-height: 0.64rem;
      text-align: center;
      border-radius: 0.08rem;
      color: #fff;
      background-color: $mainColor;
    }
  }
</style>
