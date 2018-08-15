<template lang="html">
  <div class="success-wraper">
    <div class="title">收银台</div>
    <div class="info">
      <span class="icon"></span>
      <span>支付成功</span>
    </div>
    <div class="price-info">
      <div class="company">
        邻汇网络科技有限公司
      </div>
      <div class="price-box">
        <span class="price-pre">¥</span><span class="price-number">{{ price }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      price : ''
    }
  },
  created(){
    this.price = this.$route.query.amount ;
  }
}

</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  .success-wraper{
    background-color: #fff;
  }
  .title{
    height: 0.9rem;
    line-height: 0.9rem;
    text-align: center;
    font-size: 0.32rem;
    color: #fff;
    background-color: #333;
  }
  .info{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.6rem;
    @include sc(0.4rem,$green);
    .icon{
      @include wh( 0.66rem , 0.66rem );
      margin-right: 0.1rem;
      @include bg-image('../../images/ic_success');
    }
  }
  .price-info{
    padding: 0 0.24rem 0.6rem;
    text-align: center;
    .company{
      padding: 0.4rem 0;
      border-top: 1px solid #ddd;
      @include sc(0.28rem,#333);
    }
    .price-box{
      .price-pre{
        @include sc(0.32rem,#333);
      }
      .price-number{
        @include sc(0.48rem,#333);
        font-weight: bold;
      }
    }
  }

</style>
