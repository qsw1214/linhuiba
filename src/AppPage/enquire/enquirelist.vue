<template lang="html">
  <div class="list-wraper">
    <div class="tab">
      <tab :line-width=2 active-color='#0085E3' custom-bar-width='1rem'>
        <tab-item class="vux-center" :selected="status==item.status" v-for="(item, index) in navlist" :key="index" @on-item-click="navClick( item )">
          {{item.text}}
        </tab-item>
      </tab>
    </div>
    <div class="list" v-if="hasData" v-load-more="loadingMore" type="1">
      <div class="item" v-for="( item , index ) in list" :key="index">
        <div @click.stop="itemClick(item.id)">
          <div class="title">
            <div class="tit ellipsis">{{ item.name }}</div>
            <div class="status" v-if="item.status=='enquiring'">询价中</div>
            <div class="status success" v-else-if="item.status=='enquired'">已报价</div>
            <div class="status" v-else-if="item.status=='fail'">询价失败</div>
            <div class="status" v-else>已取消</div>
          </div>
          <div class="content">
            <div class="img-box">
              <img v-lazy="item.pic_url" :data-srcset="item.pic_url | half" alt=" ">
            </div>
            <div class="norm">
              <p class="act-time"><span>活动时间：</span><span>{{ item.start | timeFormat }} - {{ item.end | timeFormat }}</span></p>
              <p class="publish-time"><span>发布日期：</span><span>{{ item.created_at }}</span></p>
            </div>
          </div>
        </div>
        <div class="btns" v-if="item.status=='enquiring'">
          <span class="silver-btn" @click.stop="deleteEnquire( item.id )">取消询价</span>
          <span class="silver-btn" @click.stop="showServer">联系客服</span>
        </div>
        <div class="enquire-success" v-else-if="item.status=='enquired'">
          <div class="price">
            <span class="text">报价：</span><span class="price-pre">¥</span><span class="price-num">{{ item.all_payment | twoPointPre }}.</span><span class="price-next">{{ item.all_payment | twoPointNext }}</span>
            <span v-if="item.deposit||item.service_fee">（押金¥{{ item.deposit }}，服务费¥{{ item.service_fee }}）</span>
          </div>
          <div class="buy">
            <!-- 有订单ID表示已经下单 无订单ID 还需判断是否过期-->
            <span v-if="item.field_order_id" class="buy-btn" @click.stop="viewOrder(item.order_status ,item.field_order_id )">查看订单</span>
            <span v-else-if="!item.field_order_id && !item.expired" class="buy-btn" @click.stop="orderNow(item)">立即下单</span>
            <span v-else-if="!item.field_order_id && item.expired" class="buy-btn not">立即下单</span>
            <span v-else></span>
          </div>
        </div>
        <div class="fail" v-else-if="item.status=='fail'">
          <span class="fail-tit">失败原因：</span>
          <p>{{ item.reason }}</p>
        </div>
        <div v-else></div>
      </div>

      <load-more v-show="is_show" :show-loading="showLoading" :tip="loadingTip" background-color="#f0f0f0"></load-more>
    </div>
    <div class="no-data" v-else>暂无数据</div>


  </div>
</template>

<script>

  import { Tab , TabItem , LoadMore } from 'vux';
  import { getEnquireList } from 'src/service/getData';
  import { timeFormat , twoPointPre , twoPointNext , half } from 'src/filters/index';
  import { loadMore } from 'src/components/mixin';
  import { setSession } from 'src/config/tools';
  import { setupWebViewJavascriptBridge } from 'src/config/tools';
export default {
  data () {
    return {
      status : 'all' , // 状态(all[全部],enquiring[询价中],enquired[已报价],fail[询价失败])
      navlist : [
        { status : 'all' , text : '全部'    },
        { status : 'enquiring' , text : '询价中'  },
        { status : 'enquired' , text : '已报价'  },
        { status : 'fail' , text : '询价失败' }
      ],
      page : 1 ,
      pageSize : 10 ,
      list : [] , // 列表数组
      hasData : true ,

      showLoading : false ,
      loadingTip : '正在加载...',
      end : false , // 到底了
      preventRepeatReuqest : false , // 阻止重复请求
      is_show : false,

      currentId : '' , // 当前操作的售卖资源id
    }
  },
  filters : { timeFormat, twoPointPre , twoPointNext , half},
  components:{ Tab, TabItem , LoadMore  },
  mixins : [ loadMore ] ,
  mounted(){
    // 初始化列表
    this.init();
  },
  methods:{
    navClick( item ){
      window.scrollTo(0,0);
      this.showLoading = false ;
      this.loadingTip = '正在加载...';
      this.end = false ; // 到底了
      this.preventRepeatReuqest = false ; // 阻止重复请求
      this.is_show = false;
      this.status = item.status ;
      this.init();
    },
    init(){
      let p = {
        page : 1, // 初始化时 始终为1
        pageSize : this.pageSize ,
        status : this.status
      };
      getEnquireList( p ).then( res => {
        this.list = res.result ;
        res.total ?
          this.hasData = true :
          this.hasData = false ;
      }).catch(err => {  })
    },
    deleteEnquire( id ){
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('deleteEnquire', id , function (data) {}) ;
      });
    },
    showServer(){
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('contactLinHuiServer', "邻汇客服" , function (data) {}) ;
      });
    },
    itemClick( id ){
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('goEnquireDetail', id , function (data) {}) ;
      });
    },
    viewOrder( status , id ){
      let obj = {
        order_status : status ,
        id : id
      };
      obj = JSON.stringify( obj );
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('viewEnquireOrder', obj , function (data) {}) ;
      });
    },
    getDate(a,b){
      let start = new Date( a ).getTime();
      let end   = new Date( b ).getTime() ;
      let temp  = (end - start)/(1*24*3600*1000) + 1;
      return temp ;
    },
    orderNow( detail ){
      if( detail.expired ) return ;
      let arr = [{
        enquiry_id : +detail.id ,
        id : +detail.sid ,
        size : detail.size ,
        lease_term_type_id : 1 ,
        count : 1,
        count_of_time_unit : this.getDate( detail.start , detail.end ) ,
        custom_dimension : '',
        start : detail.start ,
        end : detail.end,
        lease_term_type_name : '天',
        name : detail.name,
        pic_url : detail.pic_url,
        discount_rate : 0 , // 补贴率
        discount_price : detail.subsidy*100 , // 补贴钱
        field_type : detail.field_type ,
        price : detail.price*100 - detail.subsidy*100 , // 真实价格
        deposit : detail.deposit ,
        leaveWorld : '', // 留言
        service_fee : detail.service_fee // 服务费
      }];
      // 交互
      arr = JSON.stringify(arr);
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('orderEnquire', arr , function (data) {}) ;
      });
    },
    loadingMore () {

      if (this.end ) {
        return ;
      }
      //防止重复请求
      if ( this.preventRepeatReuqest ) {
        return ;
      }
      this.showLoading = true;
      this.preventRepeatReuqest = true;
      // 正在加载
      this.is_show = true ;
      this.showLoading = true ;
      this.page ++ ;

      let params = {
        page : this.page ,
        pageSize : this.pageSize,
        status : this.status
      };
      getEnquireList( params ).then( res => {
        this.list = [ ...this.list , ...res.result ];
        // 加载完成
        this.is_show = false ;
        this.showLoading = false ;
        if( res.result.length < this.pageSize ){
          this.end = true ;
          this.is_show = true ;
          this.loadingTip = '没有更多数据了';
        }
        this.preventRepeatReuqest = false;
      }).catch(err => { this.$vux.toast.text(err.msg) })

    },
  }
}

</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  .list-wraper{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .tab{
    position: absolute;
    top: 0 ;
    left: 0;
    z-index: 2;
    width: 100%;
  }
  .vux-tab{
    height: 0.8rem !important;
    .vux-tab-item{
      line-height: 0.8rem !important;
      font-size: 0.26rem !important;
    }
  }
  .list{
    position: absolute;
    top: 0.8rem;
    left: 0;
    width: 100%;
    height: 100%;
    padding-bottom: 0.8rem;
    overflow-y: scroll;
    .item{
      margin-bottom: 0.2rem;
      background-color: #fff;
      .title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 0.86rem;
        padding: 0 0.24rem;
        @include sc(0.24rem,$fontColor);
        .tit{
          width: 5.4rem;
          font-weight: bold;
        }
        .status{
          color: $red;
          &.success{
            color: $green;
          }
        }
      }
      .content{
        display: flex;
        padding: 0.2rem 0.24rem;
        background-color: #F1F2F7;
        .img-box{
          position: relative;
          img{
            width: 1.36rem;
            height: 1.36rem;
            margin-right: 0.2rem;
          }
        }
        .norm{
          padding-top: 0.1rem;
          .act-time{
            @include sc(0.24rem,$fontColor);
          }
          .publish-time{
            margin-top: 0.2rem;
            @include sc(0.22rem,#999);
          }
        }
      }
      .btns{
        padding: 0.3rem 0.24rem;
        font-size: 0;
        text-align: right;
        .silver-btn{
          display: inline-block;
          width: 1.72rem;
          height: 0.52rem;
          margin-left:0.4rem;
          line-height: 0.52rem;
          text-align: center;
          border-radius: 0.04rem;
          border: 1px solid #D8D8D8;
          @include sc(0.28rem,#666);
        }
      }
      .enquire-success{
        .price{
          height: 0.88rem;
          padding: 0 0.24rem ;
          line-height: 0.88rem;
          text-align: right;
          @include sc(0.22rem, #999);
          .text{
            @include sc(0.28rem,$fontColor);
          }
          .price-pre{
            @include sc(0.22rem,$red);
          }
          .price-num{
            @include sc(0.28rem,$red);
            font-weight: bold;
          }
          .price-next {
            @include sc(0.22rem, $red);
          }
        }
        .buy{
          border-top: 1px solid  rgba(0,0,0,0.10);
          padding: 0.3rem 0.24rem;
          text-align: right;
          .buy-btn{
            display: inline-block;
            width: 1.72rem;
            height: 0.52rem;
            margin-left:0.4rem;
            line-height: 0.52rem;
            text-align: center;
            border-radius: 0.04rem;
            border: 1px solid #FF6600;
            @include sc(0.28rem,#FF6600);
            &.not{
              border: 1px solid #D8D8D8;
              @include sc(0.28rem,#999);
            }
          }
        }
      }
      .fail{
        display: flex;
        min-height: 0.84rem ;
        padding: 0.3rem 0.24rem;
        font-weight: bold;
        @include sc(0.24rem,$fontColor);
        .fail-tit{
          width: 1.8rem;
        }
      }
    }
  }
  .no-data{
    padding-top: 1.3rem;
    text-align: center;
    font-size: 0.26rem;
    color: #999;
  }
</style>
