<template lang="html">
  <div>
    <div class="flow">
      <div class="tit">拼团流程</div>
       <div class="step">
          <div class="step-bgimg"></div>
        </div>
        <p class="desc">组团失败就退款哦~</p>
    </div>
    <div class="detail">
      <div class="item">
        <div class="title">1.场地如何拼团？</div>
        <p class="txt">因大面积场地购买费用高，将场地均分成小面积区块，参团人员支付小面积区块使用费，所有成员共同使用该场地。区块划分视为均分，实际以现场物业分配为准。</p>
      </div>
      <div class="item">
        <div class="title">2.如何算是拼团成功？</div>
        <p class="txt">拼团有效期内成功支付并被场地方审核通过的订单，达到成团人数后则表示拼团成功。</p>
        <div class="info">
          <p class="tit">注：</p>
          <p class="text">01、高峰期间同时支付的人过多，因成团人数有限，邻汇吧以接收第三方支付信息时间先后为准，超出该团人数限制部分用户则视为参团失败。<br>
          02、支付成功后由于场地方对商家品类有要求，不符合品类要求的拼团订单则可能审核被拒绝，审核未通过的订单视为参团失败。<br>
          03、拼团成功后，参团人员不能退款。           </p>
        </div>
      </div>
      <div class="item">
        <div class="title">3.拼团失败如何退款？</div>
        <p class="txt">拼团失败或参团失败的订单，系统会在1-3个工作日内处理退款，费用将原路退回至原支付账户中,若使用余额支付则立即退回至邻汇吧钱包的余额中。（所使用的积分会一并退回）</p>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {

    }
  }
}

</script>

<style lang="scss" scoped>
  @import "../../style/mixin";
  .flow{
    padding: 0.32rem 0.24rem;
    background-color: #fff;
    .title{
      font-size: 0.28rem;
    }
    .step{
      .step-bgimg{
        @include wh( 6.34rem , 0.88rem );
        margin: 0.24rem auto 0.32rem;
        @include bg-image('../../images/ic_steps_three');
      }
    }
    .desc{
      text-align: center;
      font-size: 0.26rem;
      color: #999;
    }
  }
  .detail{
    padding: 0 0.24rem 0.2rem;
    margin-top: 0.2rem;
    background-color: #fff;
    overflow: hidden;
    .item{
      margin-top: 0.6rem;
      .title{
        @include sc(0.3rem,$fontColor);
      }
      .txt{
        margin-top: 0.1rem;
        padding-left: 0.15rem;
        line-height: 0.48rem;
        @include sc(0.26rem,#666);
      }
      .info{
        width: 6.75rem;
        margin-left: 0.25rem;
        padding: 0.2rem ;
        line-height: 0.44rem;
        @include sc(0.24rem,#666);
        background-color: #f9f9f9;
        overflow: hidden;
      }
    }
  }
</style>
