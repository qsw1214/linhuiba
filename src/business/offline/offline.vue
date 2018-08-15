<template>
	<div class="offline">

    <v-head isFixed="true" goBack="true">
      <div slot="center-part">邻汇吧对公账号</div>
      <div slot="right-part" v-if="source == 'wallet'" class="rt" @click="close">关闭</div>
    </v-head>
	  <div class="">
	  	<tips><div slot="text">转账时，备注信息请填写本流水号。</div></tips>
	  	<div class="content-head">
	  		流水号：{{ serialNum }}
	  	</div>
	  	<div class="content-body">
	  		<div class="cell">
	  			<div>
	  				开户人
	  			</div>
	  			<div>
	  				{{ name }}
	  			</div>
	  		</div>
	  		<div class="cell">
	  			<div>
	  				开户行
	  			</div>
	  			<div>
	  				{{ bank }}
	  			</div>
	  		</div>
	  		<div class="cell">
	  			<div>
	  				收款账号
	  			</div>
	  			<div>
	  				{{ account }}
	  			</div>
	  		</div>
	  		<div>
	  			<div class="margin-nomal">
	  				上传转账证明
	  			</div>
	  			<div class="margin-nomal info-text">
	  				若已付款至邻汇吧对公账户，请上传转账证明
	  			</div>
	  			<div class="margin-nomal">
	  				<v-upload-img name="groud" max=1 :picArr="imgs" fileType="cert" region="z0"></v-upload-img>
	  			</div>
	  		</div>
	  	</div>
	  </div>

	  <div class="btn" @click="submitOffline">
	  	确定
	  </div>

	</div>
</template>

<script>
  import vHead from 'src/components/vHead.vue';
  import tips from 'src/components/tips.vue';
  import vUploadImg from 'src/components/vUploadImg.vue';

	import { getSession, setSession } from 'src/config/tools'
	import { walletPayDetail, walletOffline, orderOffline, getGathering, orderDetail } from 'src/service/getData'

	export default {
		data() {
			return {
				id:  '',
				source: this.$route.query.source ? this.$route.query.source : getSession("offline-type"),
				serialNum: '',
				name: '杭州邻汇网络科技有限公司',
				bank: '中国农业银行杭州西溪支行',
				account: '19053101040006506',
				imgSrc: '',
				imgs : [] ,
				list: [{
					src: ''
				}]
			}
		},
		components: {
			vHead,vUploadImg,tips
		},
		mounted() {
			this.init();
		},
		methods: {
			init(){
			  let id = this.$route.params.id ;
				// 钱包充值的对公打款
				if(this.source == 'wallet') {
					walletPayDetail(id).then(res => {
						this.serialNum = res.result.out_trade_no;
						if( res.result.voucher_image_url ){
              this.imgs.push( res.result.voucher_image_url) ;
            }
					});
				}
				//订单支付的对公打款
				if(this.source == 'order') {
					// 获取订单号
					orderDetail(id).then(res => {
						this.serialNum = res.result.order_num;
						if( res.result.voucher_image_url ){
              this.imgs.push( res.result.voucher_image_url ) ;
            }
					});

					// 不同城市对应不同的收款信息
					getGathering(id).then(res => {
						let r = res.result;
						this.name = r.account_holder;
						this.bank = r.opening_bank;
						this.account = r.beneficiary_account_number;
					})
				}
			},
			close() {
				// 钱包充值的对公打款
				if(this.source == 'wallet') {
					setSession("wallet-detail",1);
	  			this.$router.push({path:'/wallet/walletDetail',query :{type:1}});
	  		}
			},
			submitOffline() {
			  // 验证转账证明是否上传
        let img = this.imgs[0];
        if( !img ){
          this.$vux.toast.text('请上传转账证明' , 'middle');
          return ;
        }
			  let id = this.$route.params.id  ;

        let params = {
          voucher_image_url : img
        };
        if(this.source == 'wallet') {

          walletOffline( id , params ).then(res => {
            setSession('walletId' , id );
            this.$router.push({name : 'walletSuccess'})
          }).catch(err => {
            this.$vux.toast.text(err.msg);
          })
        }else if(this.source == 'order'){
          orderOffline(id , params).then(res => {
            this.$router.push('/order/paySuccess');
          }).catch(err => {
            this.$vux.toast.text(err.msg);
          })
        }
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../style/mixin";

	.offline {
		font-size: 0.28rem;

		.flex {
			display: flex;
			align-items: center;
			justify-content: space-between
		}

		.margin-nomal {
			margin-top: 0.2rem
		}

		.info-text {
			color: #999
		}

		.content-head {
			background: $white;
			padding: 0.3rem 0.3rem
		}

		.content-body {
			background: #fafafa;
			padding: 0 0.3rem
		}

		.cell {
			padding: 0.2rem 0;
			@include bb-1px(#eee);
			@extend .flex
		}

		.upload-img {
			display: inline-block;
	    @include wh( 1.2rem , 1.2rem );
	    @include bg-image( "../../images/ic_photo_two_four_one" );
	    background-size: 1.2rem 1.2rem;
		}

		.btn {
			width: 90%;
			height: 0.88rem;
			line-height: 0.88rem;
			text-align: center;
			border-radius: 0.04rem;
			color: $white;
			background: $mainColor;
			margin: 0.6rem auto;
			font-size: 0.32rem
		}

		.voucher-img {
			display: inline-block;
			width: 2rem;
			height: 2rem;
		}

		.header {
			position: relative;
			padding: 0.3rem 0.3rem;
			text-align: center;
			font-size: 0.36rem;
			background: $white;
			@include bb-1px(#eee);

			span:last-child {
				position: absolute;
				right: 0.3rem;
				top: 0.35rem;
				font-size: 0.3rem;
			}
		}
	}
</style>
