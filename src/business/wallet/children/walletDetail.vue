<template>
	<div class="wallet-detail">
		<v-head go-back="true" isFixed="true">
	    <div slot="center-part">{{ title }}</div>
	  </v-head>
	  <!-- 充值明细 -->
	  <div v-if="type == 1" v-load-more="loadingMore">
      <div v-if="payList.length">

	  	  <div class="cells" v-for="(item,index) in payList" :class="{'margin-small':index > 0 }">
	  		<div class="cell-header">
	  			<div>流水号:{{ item.out_trade_no }}</div>
	  			<div>
	  				<span v-if="item.confirmed == 0">待入账</span>
	  				<span v-if="item.confirmed == 1">已入账</span>
	  			</div>
	  		</div>
	  		<div class="cell-content">
	  			<div class="info">
	  				<div>充值金额：¥{{ item.amount /100 }}</div>
		  			<div>{{ item.created_at }}</div>
		  		</div>
	  			<div class="way">
	  				<div v-if="item.payment_mode == 0">
	  					<span class="offline-img"></span>
	  					<span class="img-text">对公打款</span>
	  				</div>
	  				<div v-if="item.payment_mode == 1 || item.payment_mode == 2 || item.payment_mode == 3 || item.payment_mode == 5 || item.payment_mode == 6 || item.payment_mode == 7">
	  					<span class="wechat-img"></span>
	  					<span class="img-text">微信支付</span>
	  				</div>
	  				<div v-if="item.payment_mode == 4">
	  					<span class="wallet-img"></span>
	  					<span class="img-text">钱包支付</span>
	  				</div>
	  				<div v-if="item.payment_mode == 8 || item.payment_mode == 9 || item.payment_mode == 10">
	  					<span class="alipay-img"></span>
	  					<span class="img-text">支付宝支付</span>
	  				</div>
	  				<div class="flex" v-if="item.payment_mode == 0 && item.confirmed == 0">
		  				<!--<div class="delete-doc" @click.stop="deleteWallet(item.id)">-->
		  					<!--取消付款-->
		  				<!--</div>-->
		  				<div class="upload-doc margin-left-small" @click="toOffline(item.id)">
		  					上传凭证
		  				</div>
		  			</div>
		  			<div v-if="item.payment_mode == 0 && item.confirmed == 1">
		  				<div class="upload-doc" @click="toOffline(item.id)">
		  					查看凭证
		  				</div>
		  			</div>
	  			</div>
	  		</div>
	  	</div>

      </div>
      <div class="no-data" v-else>暂无数据</div>
	  </div>
	  <!-- 消费明细 -->
	  <div v-if="type == 2" v-load-more="loadingMore">
      <div v-if="consumptionList.length">
        <div class="cell-item" v-for="(item,index) in consumptionList" :class="{'margin-small':index > 0}">
          <router-link :to="{name:'consumptionDetail',params:{id:item.id}}">
            <div class="flex">
              <div class="tit">{{ item.name }}</div>
              <div :class="{ red : item.amount>0 }" class="amount"><span class="red" v-if="item.amount>0">+</span>{{ item.amount/100 }}</div>
            </div>
            <div class="flex order-num">
              <div>
                订单号：{{ item.out_trade_no }}
              </div>
              <div>
                {{ item.created_at }}
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <div class="no-data" v-else>暂无数据</div>

	  	<transition name="router-slid" mode="out-in">
        <router-view></router-view>
      </transition>
	  </div>
	  <load-more v-show="is_show" :tip="loadingTip" :show-loading="showLoading" background-color="transparent"></load-more>

	</div>
</template>

<script>
	import vHead from '../../../components/vHead'
	import { LoadMore, Confirm, Toast } from 'vux'
	import { loadMore } from '../../../components/mixin'
	import { walletDetail, deleteWallet } from '../../../service/getData'
	import { getSession, setSession } from '../../../config/tools'

	export default {
		data() {
			return {
				title: '',
				type: null,
				payList: [],
	      consumptionList: [],
	      showLoading: false,
      	loadingTip: '加载中...',
      	end: false, // 到底了
      	preventRepeatReuqest: false, // 阻止重复请求
      	params: {
      		page: 1,
        	pageSize: 10,
        	type: this.$route.query.type ? this.$route.query.type : getSession('wallet-detail')
      	},
      	is_show: false,
      	transactionType: '',

			}
		},
		// 混合对象
		mixins: [loadMore],
		components : {
	    vHead,
	    LoadMore,
	    Confirm,
	    Toast
	  },
	  mounted() {
	  	this.init();
	  },
	  methods: {
	  	init() {
	  		let type = this.params.type;
	  		if(type == 1) {
	  			this.title = "充值明细";
	  			this.type = 1;
	  		}
	  		if(type == 2) {
	  			this.title = "余额消费明细";
	  			this.type = 2;
	  		}

	  		walletDetail(this.params).then(res => {
	  				let r = res.result;
	  				if(type == 1) {
	  					this.payList = r.data;
	  				}
	  				if(type == 2) {
	  					this.consumptionList = r.data;
	  				}
	  		});
	  	},
	  	loadingMore() {
	  		if(this.end) {
	  			return;
	  		}
	  		if (this.preventRepeatReuqest) {
	        return;
	      }
	  		this.showLoading = true;
      	this.preventRepeatReuqest = true;

	      // 正在加载
	      this.is_show = true;
	      this.showLoading = true;

	      this.params.page++;

	      walletDetail(this.params).then(res => {
	      	if(this.params.type == 1) {
	      		this.payList = [...this.payList,...res.result.data];
	      	}
	      	if(this.params.type == 2) {
	      		this.consumptionList = [...this.consumptionList,...res.result.data];
	      	}

	      	this.is_show = false;
          this.showLoading = false;

          if (res.result.data.length < this.params.pageSize) {
            this.end = true;
            this.is_show = true;
            this.loadingTip = '没有更多数据了';
          }
          this.preventRepeatReuqest = false;

	      })
	  	},
	  	deleteWallet(id) {
	  		let that = this;
	  		this.$vux.confirm.show({
	  			confirmText: '是',
        	cancelText: '否',
        	title: '删除该订单',
        	content: '确认删除此订单',
        	onConfirm() {
        		deleteWallet(id).then(res => {
        			if(res.code == 1) {
        				that.payList = [];
        				that.params = {
        					page: 1,
        					pageSize: 10,
        					type: 1
        				};
        				that.showLoading = false,
              	that.loadingTip = '正在加载...',
              	that.end = false,
              	that.preventRepeatReuqest = false,
              	that.is_show = false,
              	that.init();
        			}
        			else {
        				that.$vux.toast.text(res.msg,this.position);
        				return;
        			}
        		}).catch(err => {
        			that.$vux.toast.text(err.msg,this.position);
        			return;
        		})
        	}
	  		})
	  	},
	  	toOffline(id) {
	  		setSession("offline-type",'wallet');
				this.$router.push({name:'offline',params: {id:id} , query: {source:'wallet'}});
	  	}
	  }
	}
</script>
<style lang="scss" scoped>
	@import "../../../style/mixin";

	.router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
   }

  .router-slid-enter, .router-slid-leave-active {
    transform: translateX( 100% );
    opacity: 0;
  }
  .no-data{
    margin: 2rem  0;
    text-align: center;
    @include sc(0.28rem,#999);
  }
	.wallet-detail {
		@include allcover;
		@include wh(100%, 100%);
		background-color: $bgc;
    z-index: 100;

		a {
			display: block;
		}
		.flex {
			display: flex;
			align-items: center;
			justify-content: space-between
		}

		@mixin btn($border-color,$color) {
			display: inline-block;
			border: 1px solid $border-color;
			color: $color;
			padding: 0.12rem 0.24rem;
			border-radius: 0.08rem
		}

		@mixin line($height) {
			height: $height;
			line-height: $height
		}

		.cells {
			font-size: 0.28rem
		}

		.margin-small {
			margin-top: 0.1rem
		}

		.margin-left-small {
			margin-left: 0.2rem
		}

		.vertical-middle {
			vertical-align: middle
		}

		.red {
			color:#F65656
		}
    .amount{
      font-size: 0.22rem;
    }
    .tit{
      font-size: 0.3rem;
      font-family: PingFangSC-Regular;
    }
		.img-text {
			@extend .vertical-middle;
			padding-left: 0.2rem
		}

		.cell-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			background: $white;
			padding: 0.3rem
		}

		.cell-content {
			background: #fafafa;
			padding: 0.3rem;
			.info {
				@extend .flex;
				@include line(0.8rem)
			}
			.way {
				@extend .flex
			}
		}
    .order-num{
      margin-top: 0.1rem;
      @include sc(0.22rem,#999);
    }
		.cell-item {
			background: $white;
			padding: 0.3rem;
			font-size: 0.28rem;
			div {
				@include line(0.5rem)
			}
		}

		.upload-doc {
			@include btn(#00a2ff,#00a2ff)
		}
		.delete-doc {
			@include btn(#ccc,#333)
		}

		.offline-img {
			display: inline-block;
		  @include wh( 0.4rem , 0.3rem );
		  @include bg-image( "../../../images/ic_paid_two_four_one" );
		  background-size: 0.4rem 0.3rem;
		 	@extend .vertical-middle
		}
		 .wechat-img {
			display: inline-block;
		  @include wh( 0.42rem , 0.3rem );
		  @include bg-image( "../../../images/ic_wechat_two_four_one" );
		  background-size: 0.42rem 0.3rem;
		  @extend .vertical-middle
		}
		.wallet-img {
			display: inline-block;
		  @include wh( 0.44rem , 0.38rem );
		  @include bg-image( "../../../images/ic_wallet_two_four_one" );
		  background-size: 0.44rem 0.38rem;
		  @extend .vertical-middle
		}
		.alipay-img {
			display: inline-block;
		  @include wh( 0.36rem , 0.36rem );
		  @include bg-image( "../../../images/ic_alipay_two_six" );
		  background-size: 0.36rem 0.36rem;
		  @extend .vertical-middle
		}
	}
</style>
