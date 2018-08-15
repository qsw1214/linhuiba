<template>
  <div>
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
	import { getMessage, badgeMessage , userInfo } from '../../service/getData';
  import { setupWebViewJavascriptBridge } from 'src/config/tools';
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
			LoadMore
		},

		mounted() {
	  	this.init();
	  },
		methods: {
			init() {
        userInfo().then(res => {
          this.id = res.result.id;
          let msg_ids = [];
          getMessage(this.id ,this.params).then(res => {
            this.messageList = res.result.data;

            for(let i = 0;i < this.messageList.length; i++) {
              msg_ids.push(this.messageList[i].id)
            }
            this.badgeRead(msg_ids);
          }).catch(err => {})
        }).catch(err => {});
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
			  setupWebViewJavascriptBridge(function(b){
          b.callHandler( 'PushMessageClick' , url , function(data){} )
        });
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
