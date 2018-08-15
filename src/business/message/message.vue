<template>
  <div>

    <v-head isFixed="true" path="/admin/profile">
      <div slot="center-part">推送消息</div>
    </v-head>
    <div class="message-list" v-load-more="loadingMore">
      <div class="message-item" v-for="(item,index) in messageList" @click.stop="msgItemClick(item)">
        <div class="message-header">
          {{ item.created_at }}
        </div>
        <div class="message-body" :data="JSON.stringify(item)">
          <div>
            {{ item.title }}
          </div>
          <div>
            {{ item.content }}
          </div>
        </div>
      </div>
      <load-more v-show="is_show" :tip="loadingTip" :show-loading="showLoading" background-color="transparent"></load-more>
    </div>
    <div class="no-data" v-if="!messageList.length">暂无数据</div>
  </div>
</template>

<script>
	import { LoadMore } from 'vux';
	import { getSession } from '../../config/tools';
	import { loadMore } from '../../components/mixin';
	import { getMessage, badgeMessage} from '../../service/getData';
  import vHead from 'src/components/vHead.vue' ;
	export default {
		data() {
			return {
				id: '',
				messageList: [],
				params: {
					page: 1,
					pageSize: 10
				},
				showLoading: false,
      	loadingTip: '加载中...',
      	end: false,
      	preventRepeatReuqest: false,
      	is_show: false
			}
		},
		mixins: [loadMore],
		components: {
			LoadMore,vHead
		},
		created(){
		  this.$vux.loading.show({
        text : 'loading'
      });
    },
		mounted() {
	  	this.init();
	  },
		methods: {
			init() {
				let userInfo = getSession("userInfo");
				if(userInfo) {
					this.id = userInfo.id;
					let msg_ids = [];
					getMessage(this.id,this.params).then(res => {
							this.messageList = res.result.data;
							this.$vux.loading.hide();
							for(let i = 0;i < this.messageList.length; i++) {
								msg_ids.push(this.messageList[i].id)
							}
							this.badgeRead(msg_ids);
					}).catch(err => { this.$vux.loading.hide(); })
				}
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
	      let msg_ids = [];

	      getMessage(this.id,this.params).then(res => {

          this.messageList = [...this.messageList,...res.result.data];
          this.is_show = false;
          this.showLoading = false;

          for(let i = 0;i < this.messageList.length; i++) {
              msg_ids.push(this.messageList[i].id)
            }

          this.badgeRead(msg_ids);

          if (res.result.data.length < this.params.pageSize) {
            this.end = true;
            this.is_show = true;
            this.loadingTip = '没有更多数据了';
          }
          this.preventRepeatReuqest = false;
	      })
	  	},
	  	badgeRead(ids) {
	  		if(ids.length > 0) {
	  			let ids_str = ids.join();
	  			badgeMessage(this.id,ids_str).then(res => {

	  			}).catch(err => {
	  				this.$vux.toast.text(err.msg);
	  			})
	  		}
	  	},
      msgItemClick(item){
			  let url = item.url ;
			  if( !url ) return ;

        let orderReg = /admin\/orders\/view/gi , // 大订单详情
            invoiceReg = /admin\/invoices\/view/gi , // 票据详情
            walletReg = /admin\/wallets\/index/gi , // 钱包充值详情
            pointsReg = /admin\/points\/index/gi , // 积分主页
            commentsReg = /admin\/comments\/edit/gi , // 评价页
            enquireReg = /admin\/enquiry\/view/gi , // 询价详情
            requirementsReg = /admin\/requirements\/details/gi ; // 需求详情
        if( orderReg.test(url) ){

          let n = url.indexOf( 'view' );
          let id = url.substr( n+5 );
          //  跳往大订单详情页
          this.$router.push({ name : 'bigOrderDetail' , params : { id : +id } });
        }

        if( invoiceReg.test(url) ){

          let n = url.indexOf( 'view' );
          let id = url.substr( n+5 );
          //  跳往票据详情页
          this.$router.push({ name : 'invoiceDetail' , params : { id : +id } });
        }

        if( walletReg.test(url) ){

          this.$router.push('/wallet');
          //  wallet
        }

        if( pointsReg.test(url) ){

          this.$router.push('/point');
          //  point
        }

        if( commentsReg.test(url) ){

          let n = url.indexOf( 'edit' );
          let id = url.substr( n+5 );
          //  跳往评价页
          this.$router.push({ name : 'commentDetail' , params : { id : +id } });
          //  comments
        }

        if( enquireReg.test(url) ){
          let n = url.indexOf( 'view' );
          let id = url.substr( n+5 );
          //  跳往询价详情页
          this.$router.push({ name : 'enquireDetail' , params : { id : +id } });
        }

        if( requirementsReg.test(url) ){

          let n = url.indexOf( 'details' );
          let id = url.substr( n+8 );
          //  跳往需求详情页
          this.$router.push({ name : 'demandDetail' , params : { id : +id } });
          //  requirements
        }
        return false;
      }
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../style/mixin";

	.message-list {
		font-size: 0.28rem;

		.message-item {
			padding: 0 0.3rem
		}

		.message-header {
			line-height: 0.8rem;
			text-align: center
		}

		.message-body {
			width: 100%;
			height: 100%;
			background: $white;
			padding: 0.2rem 0.3rem;
			border-radius: 0.16rem;
			div {
				line-height: 0.4rem
			}
		}
	}
  .no-data{
    height: 2rem;
    line-height: 2rem;
    text-align: center;
    font-size: 0.28rem;
    color: #999;
    background-color: $bgc;
  }
</style>
