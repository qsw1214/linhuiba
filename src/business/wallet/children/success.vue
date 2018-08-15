<template>
	<div class="wallet-success">
    <v-head path="/wallet">
      <div slot="center-part">充值</div>
    </v-head>
		<div class="header-content">
			<div class="success-img"></div>
			<div>
				充值申请已提交，请等待入账
			</div>
		</div>
		<div class="body-content">
			<div class="flex has-divider">
				<div>
					支付方式
				</div>
				<div>
					{{ mode }}
				</div>
			</div>
			<div class="flex">
				<div>
					充值金额
				</div>
				<div>
					￥{{ amount }}
				</div>
			</div>
		</div>
		<router-link class="btn" to="/wallet">
			完成
		</router-link>
	</div>
</template>

<script>
	import { walletPayDetail } from '../../../service/getData'
  import vHead from 'src/components/vHead.vue';
	import { getSession } from 'src/config/tools';
	export default {
		data() {
			return {
				id: getSession('walletId'),
				mode: '',
				amount: ''
			}
		},
		components:{vHead},
		mounted() {
			this.init();
		},
		methods: {
			init: function() {

				walletPayDetail(this.id).then(res => {
					let r = res.result;
					this.amount = r.amount / 100;
					if(r.payment_mode == 0) {
						this.mode = "对公打款";
					}
					if(r.payment_mode == 1 || r.payment_mode == 2 || r.payment_mode == 3 || r.payment_mode == 5 || r.payment_mode == 6 || r.payment_mode == 7) {
						this.mode = "微信支付";
					}
					if(r.payment_mode == 8 || r.payment_mode == 9 || r.payment_mode == 10) {
						this.mode = "支付宝支付";
					}
				}).catch(err => {
					this.$vux.toast.text(err.msg)
				})
			}
		}
	}
</script>

<style lang="scss">
	@import "../../../style/mixin";

	html,body {
		background: $bgc
	}
</style>

<style lang="scss" scoped>
	@import "../../../style/mixin";

	.router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
   }

  .router-slid-enter, .router-slid-leave-active {
    transform: translateX( 100% );
    opacity: 0;
  }

  .wallet-success {
  	@include allcover;
		@include wh(100%, 100%);
		background-color: $bgc;
    z-index: 100;
    font-size: 0.28rem;

    .flex {
			display: flex;
			align-items: center;
			justify-content: space-between
		}

    .success-img {
    	@include wh( 1.34rem , 1.26rem );
		  @include bg-image( "../../../images/ic_complete_two_four_one" );
		  background-size: 1.34rem 1.26rem;
		  margin: 0.4rem auto;
    }

    .header-content {
    	text-align: center;
    }

    .body-content {
    	background: $white;
    	padding: 0 0.3rem;
    	line-height: 0.8rem;
    	margin: 0.4rem 0;
    }

    .has-divider {
    	@include bb-1px(#eee);
    }

    .btn {
    	display: block;
    	width: 90%;
			height: 0.8rem;
			line-height: 0.8rem;
			text-align: center;
			border-radius: 0.04rem;
			color: $white;
			background: $mainColor;
			margin: 0.4rem auto;
		}
  }
</style>
