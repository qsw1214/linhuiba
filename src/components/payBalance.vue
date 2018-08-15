<template>
	<div class="pay-wallet" v-if="payBalance" :class="{active:payBalance}">
		<div class="mask"></div>
		<div class="model">
			<div class="model-header">
				<div class="close" @click="closeBalance">
					+
				</div>
				<div class="title">
					请输入支付密码
				</div>
				<div>
					<!-- to="/wallet/walletPassword" -->
					<div @click="forgetPwd">忘记密码？</div>
				</div>
			</div>
			<div class="model-content">
				<div class="amount">
					<span class="symbol">￥</span>
					<span>{{ sum | twoPoint }}</span>
				</div>
				<input type="hidden" :value="balanceType">
				<input type="hidden" :value="orderId">
				<div class="password-box">
					<input type="text" class="real-input" v-model="password">
					<div class="password-input">
						<input type="password" :value="password ? password[0] : ''" disabled>
						<input type="password" :value="password ? password[1] : ''" disabled>
						<input type="password" :value="password ? password[2] : ''" disabled>
						<input type="password" :value="password ? password[3] : ''" disabled>
						<input type="password" :value="password ? password[4] : ''" disabled>
						<input type="password" :value="password ? password[5] : ''" disabled>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { payOrders, payInvoices } from 'src/service/getData'
	import { setSession } from 'src/config/tools'
  import { twoPoint } from 'src/filters/index';
	export default {
		name: 'pay-balance',
		data() {
			return {
				password: ''
			}
		},
		// 父组件传来的参数
		props: ['payBalance','sum','orderId','balanceType', 'group'],// 是否显示组件、支付金额、订单id、支付接口选取
		// init函数需要删除，测试用的函数
		filters:{ twoPoint },
		watch: {
			password: function() {
				this.password = this.password.replace(/[^\d]/g,'');
				if(this.password.length == 6) {
	  			// 根据支付类型调用不同的支付接口
	  			// 票据支付的钱包支付
	  			let id = this.orderId;
	  			let params = {
            payment_mode: 4,
            password: this.password
          };
	  			if(this.balanceType == 'invoice') {
            payInvoices(id,params).then(res =>{
              this.$router.replace('/invoice/paySuccess');
	  				}).catch(err => {
	  					this.$vux.toast.text(err.msg);
	  				})
	  			}
	  			// 订单支付的钱包支付
	  			if(this.balanceType == 'order') {
	  				payOrders(id,params).then(res => {
	  				  if(this.group){
                this.$router.replace('/group/paySuccess');
              }else{
                this.$router.replace('/order/paySuccess');
              }
	  				}).catch(err => {
	  					this.$vux.toast.text(err.msg);
	  				})
	  			}
	  		}
	  		else {
	  			this.password = this.password.substring(0,6);
	  		}
			}
		},
		methods: {

			closeBalance: function() {
				this.password = '';
				this.$emit('closeBalance');
			},
			forgetPwd: function() {
				setSession("payment-status",true);
				this.$router.push('/wallet/walletPassword');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.flex {
		display: flex;
		align-items: center;
		justify-content: space-around
	}

	.hide {
		display: none
	}

	@keyframes pay-wallet-show {
		0% {opacity: 0.1}
    30% {opacity: 0.3}
    60% {opacity: 0.6}
    100% {opacity: 1}
	}

	.active {
		animation-name: pay-wallet-show;
		animation-duration: 0.2s;
	}

	.pay-wallet {
		a {
			color: #00a2ff
		}

		.mask {
			position: fixed;
	    z-index: 1000;
	    top: 0;
	    right: 0;
	    left: 0;
	    bottom: 0;
	    background: rgba(0, 0, 0, .6);
		}

		.model {
			position: fixed;
			z-index: 1001;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			background-color: #fff;
			width: 90%;
			max-width: 90%;
			height: auto;
			border-radius: 0.25rem;

			font-size: 0.28rem
		}

		.close {
			font-size: 0.7rem;
			transform: rotate(45deg)
		}

		.model-header {
			@extend .flex;
			position: relative;
			line-height: 0.9rem;
			&:before {
				position: absolute;
				left: 0;
				bottom: 0;
				width: 100%;
				border-top: 1px solid #eee;
				content: ''
			}
		}

		.model-content {
			padding: 0 0.3rem;
		}

		.title {
			margin-left: 1rem;
			font-size: 0.32rem;
			font-weight: 900
		}

		.amount {
			position: relative;
			text-align: center;
			line-height: 0.8rem;
			font-size: 0.45rem;
			.symbol {
				font-size: 0.28rem
			}
			&:before {
				position: absolute;
				left: 0;
				bottom: 0;
				width: 100%;
				border-top: 1px solid #eee;
				content: ''
			}
		}

		.password-box {
			position: relative;
			margin: 0.6rem auto;
			width: 90%;
			height: 1rem;
			.password-input {
				position: absolute;
				width: 100%;
				height: 100%;
				border: 1px solid #ccc;
				overflow: hidden;
				z-index: 0;
				border-radius: 0.14rem;
				input {
					padding: 0;
					width: 16.65%;
					height: 100%;
					float: left;
					background: #fff;
					text-align: center;
					border: none;
					outline: 0;
					border-right: 1px solid #ccc
				}
				input:last-child {
					border-right: 0;
				}
			}
			.real-input {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				z-index: 1;
				opacity: 0
			}
		}
	}
</style>
