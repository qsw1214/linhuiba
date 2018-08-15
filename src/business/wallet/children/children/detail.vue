<template>
	<div class="wallet-children-detail">
		<v-head go-back="true">
	    <div slot="center-part">消费明细</div>
	  </v-head>
    <div v-if="details">
      <div class="price-info">
        <div class="icon"></div>
        <div class="price">
          <span class="price-pre">¥</span><span class="price-num">{{ details.amount/100 }}</span>
        </div>
        <p class="txt">{{ details.name }}</p>
      </div>
      <div class="order-info">
        <div class="item">
          <span>订单号：</span>
          <span>{{ details.order_num }}</span>
        </div>
        <div class="item">
          <span>支付方式：</span>
          <span>{{ details.payment_mode | payModel }}</span>
        </div>
        <div class="item">
          <span>商品说明：</span>
          <span>{{ details.goods }}</span>
        </div>
        <div class="item">
          <span>创建时间：</span>
          <span>{{ details.created_at }}</span>
        </div>

      </div>
    </div>
	</div>
</template>

<script>
	import vHead from 'src/components/vHead';
	import { walletPayDetail } from 'src/service/getData';
  import { payModel } from 'src/filters/index';
	export default {
		data() {
			return {
				id: this.$route.params.id,
			  details  : null
			}
		},
		components: {
			vHead
		},
		filters:{ payModel },
		mounted() {
	  	this.init();
	  },
		methods: {
			init: function() {
				walletPayDetail(this.id).then(res => {
				  this.details = res.result ;
				}).catch(err => {})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../../../style/mixin";

	.wallet-children-detail {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    background-color: $bgc;
    z-index: 100;
    font-size: 0.28rem;
  }
  .price-info{
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
    text-align: center;
    background-color: #fff;
    .icon{
      @include wh(1.32rem,1.32rem);
      margin: 0 auto;
      @include bg-image('../../../../images/ic_success');
    }
    .price{
      margin-top: 0.25rem;
      .price-pre{
        font-size: 0.36rem;
      }
      .price-num{
        font-size: 0.6rem;
        font-weight: bold;
      }
    }
    .txt{
      margin-top: 0.1rem;
      @include sc(0.28rem,#999);
    }
  }
  .order-info{
    padding: 0.1rem 0.24rem;
    background-color: #fff;
    .item{
      display: flex;
      justify-content: space-between;
      line-height: 0.6rem;
      font-size: 0.24rem;
      span:nth-of-type(1){
        color: #999;
      }
    }
  }
</style>
