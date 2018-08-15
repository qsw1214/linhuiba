<template>
	<div class="wallet">
		<v-head path="/admin/profile">
	    <div slot="center-part">我的钱包</div>
	  </v-head>
		<div class="header-content">
			<div class="align-right">
				<span class="question-img vertical-middle"></span>
				<router-link :to="{name:'article' , params : {id : 72} , query:{page:'help'} }" class="font-white vertical-middle">钱包说明</router-link>
			</div>
			<div class="price">
				可用余额（元）
			</div>
			<div class="price-num">
				{{ balance }}
			</div>
			<div class="line"></div>
			<div class="font-normal flex-box">
				<span>待入账</span>
				<span>{{ unconfirmed }}</span>
			</div>
		</div>

		<div class="table-view">
			<div class="cell has-divider" @click="payDetail">
				<div>
					<span class="vertical-middle pay-img"></span>
					<span class="vertical-middle">充值明细</span>
				</div>
				<div class="arrow-box">
				 	<span class="gray-arrow"></span>
				</div>
			</div>
			<div class="cell" @click="consumptionDetail">
				<div>
					<span class="vertical-middle consume-img"></span>
					<span class="vertical-middle">余额消费明细</span>
				</div>
				<div class="arrow-box">
				 	<span class="gray-arrow"></span>
				</div>
			</div>
		</div>
		<div class="table-view">
			<router-link class="cell" to="/wallet/walletPassword">
				<div>
					<span class="vertical-middle set-img"></span>
					<span class="vertical-middle">支付设置</span>
				</div>
				<div class="arrow-box">
				 	<span class="gray-arrow"></span>
				</div>
			</router-link>
		</div>

		<router-link to="/walletFill" class="pay-btn">
			充值
		</router-link>

		<transition name="router-slid" mode="out-in">
    	<router-view></router-view>
   	</transition>
	</div>
</template>

<script>
	import vHead from '../../components/vHead'
	import { walletInfo } from '../../service/getData'
	import { setSession } from '../../config/tools'

	export default {
		data() {
			return {
				balance: '',
				unconfirmed: ''
			}
		},
		components : {
	    vHead
	  },
	  mounted() {
	  	this.init();
	  },
	  methods: {
	  	init() {
	  		walletInfo().then(res => {
      		if(res.code == 1) {
      			this.balance = res.result.balance / 100;
      			this.unconfirmed = res.result.unconfirmed / 100;
      		}
      	});
	  	},
	  	payDetail() {
	  		setSession("wallet-detail",1);
	  		this.$router.push({path:'/wallet/walletDetail',params:{type:1}});
	  	},
	  	consumptionDetail() {
	  		setSession("wallet-detail",2);
	  		this.$router.push({path:'/wallet/walletDetail',params:{type:2}});
	  	}

	  }
	}

</script>


<style lang="scss" scoped>
	@import "../../style/mixin";

	.router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
   }

  .router-slid-enter, .router-slid-leave-active {
    transform: translateX( 100% );
    opacity: 0;
  }

	.wallet{
    background-color: $bgc;
		.font-white {
			color: $white;
		}

		.align-right {
			text-align: right;
		}

		.vertical-middle {
			vertical-align: middle;
		}

    .price{
      margin-top: 0.2rem;
      font-size: 0.28rem
    }
    .price-num{
      height: 0.45rem;
      margin-top: 0.2rem;
      font-size: 0.4rem;
    }

		.font-big {
			font-size: 0.5rem
		}

		.line {
			margin-top: 0.2rem;
			margin-bottom: 0.2rem;
			border-top: 1px solid #459DFA;
		}

		@mixin arrow-right($size,$thickness,$color,$distance) {
		  content: "";
		  position: absolute;
		  width: $size;
		  height: $size;
      border-style: solid;
      border-color: $color;
		  border-width: 0 $thickness $thickness 0;
		  -webkit-transform: rotate(315deg);
		          transform: rotate(315deg);
		  right: $distance;
		}

		.arrow-box {
		 	position: relative;
		 	color: $white;
		 	.white-arrow {
		 		@include arrow-right(0.24rem,1px,#fff,0.14rem);
		 		top: -0.1rem;
		 	}
		 	.gray-arrow {
		 		@include arrow-right(0.24rem,1px,#666,0.14rem);
		 		top: -0.1rem;
		 	}
		}

		.header-content {
		  width: 100%;
		  height: auto;
		  color: $white;
		  padding: 0.2rem 0.3rem;
		  background: -webkit-linear-gradient(#09a2fe, #3984fe);
		  background: -o-linear-gradient(#09a2fe, #3984fe);
		  background: linear-gradient(#09a2fe, #3984fe);
		  text-align: center;
		}

		.question-img {
			display: inline-block;
	    @include wh( 0.3rem , 0.3rem );
	    @include bg-image( "../../images/ic_explain_two_four_one" );
	    background-size: 0.3rem 0.3rem;
		}
		.flex-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.table-view {
			background: $white;
			@include sc(0.28rem,#333);
			margin-top: 0.2rem;
			padding: 0 0.3rem;
			.cell {
				@extend .flex-box;
				padding: 0.3rem -0.3rem;
				height: 0.8rem;
			}
			.has-divider {
				border-bottom: 1px solid #ddd;
			}
		}

		.pay-img {
			display: inline-block;
	    @include wh( 0.4rem , 0.4rem );
	    @include bg-image( "../../images/ic_recharge_two_four_one" );
	    background-size: 0.4rem 0.4rem;
		}

		.consume-img {
			display: inline-block;
	    @include wh( 0.4rem , 0.4rem );
	    @include bg-image( "../../images/ic_mingxi_two_four_one" );
	    background-size: 0.4rem 0.4rem;
		}

		.set-img {
			display: inline-block;
	    @include wh( 0.4rem , 0.4rem );
	    @include bg-image( "../../images/ic_payment_settings_two_four_one" );
	    background-size: 0.4rem 0.4rem;
		}
		.pay-btn {
      display: block;
			width: 90%;
			height: 0.88rem;
			line-height: 0.88rem;
			text-align: center;
			border-radius: 0.04rem;
      font-size: 0.34rem;
			color: $white;
			background: $mainColor;
			margin: 0.4rem auto;
		}
	}
</style>

