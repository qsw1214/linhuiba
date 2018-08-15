<template lang="html">
  <div class="invoices-success">
    <v-head isFixed="true" path="/myInvoice">
      <div slot="center-part">申请成功</div>
    </v-head>
    <div class="pay-success">
      <div class="bgi"></div>
      <div class="txt">票据申请成功</div>
    </div>
    <p class="time-info">邻汇吧每周四开具，周五寄出，请耐心等待。</p>
    <p class="tips">[普通发票]的电子发票，请查看接受邮箱。</p>
    <router-link to="/myInvoice" class="back-btn">返回票据列表</router-link>
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
  .invoices-success{
    overflow: hidden;
    background-color: #fff;
    .pay-success{
      padding-top: 1.8rem;
      .bgi{
        margin: 0 auto;
        @include wh( 1.32rem , 1.32rem );
        @include bg-image('../../images/ic_success');
      }
      .txt{
        margin-top: 0.5rem;
        font-size: 0.36rem;
        text-align: center;
      }
    }
    .time-info{
      margin-top: 0.7rem;
      @include sc(0.26rem,#A9A9A9);
      text-align: center;
    }
    .tips{
      margin-top: 0.1rem;
      @include sc(0.26rem,#A9A9A9);
      text-align: center;
    }
    .back-btn{
      display: block;
      margin: 1rem auto;
      @include wh(3.2rem,0.92rem);
      line-height: 0.92rem;
      text-align: center;
      @include sc(0.36rem ,#fff);
      border-radius: 0.08rem;
      background-color: $mainColor;
    }
  }
</style>
