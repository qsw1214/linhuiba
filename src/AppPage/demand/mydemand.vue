<template lang="html">
  <div>
    <div class="mask" @click="back"></div>
    <app-head isFixed="true">
        <div slot="center-part">我的需求</div>
    </app-head>
    <div>
       <tab :line-width=2 active-color='#0077FF' custom-bar-width='1.8rem' v-model="status">
            <tab-item class="vux-center" @on-item-click="tabClick">待处理</tab-item>
            <tab-item class="vux-center"  @on-item-click="tabClick">已处理</tab-item>
        </tab>
        <div class="tab-wraper" v-load-more="loadingMore" type="1">
          <div class="tab-left" v-if="status==0">
            <div class="tab-swiper vux-center"  v-if="pendings.length">
              <div class="pending-item" v-for="( item , index ) in pendings" :key="index">
                <router-link :to="{ name : 'appDemandDetail' , params : { id : item.id } }">
                  <div class="title gutter">
                    <span class="time">{{ item.created_at }}</span>
                    <div class="right status">待处理</div>
                  </div>
                  <div class="demand gutter">
                      <span>所需城市：</span>
                       <span class="citys ellipsis">
                         <span v-for="(city,i) in item.appeal_cities" :key="i">{{ city.city.city_name }}</span>
                       </span>
                      <span class="vertical-line"></span>
                      <span>推广形式：</span>
                      <span v-if="item.spread_way">{{ item.spread_way.spread_way_name }}</span>
                  </div>
                  <!--<div class="demand-result clear gutter">-->
                      <!--<div class="left">处理结果：</div>-->
                      <!--<div class="overflow doubleellipsis">-->
                          <!--{{ item.result }}-->
                      <!--</div>-->
                  <!--</div>-->
                </router-link>
              </div>
            </div>
            <div class="no-data" v-else>暂无数据</div>
          </div>
          <div class="tab-right" v-if="status==1">
            <div class="tab-swiper vux-center"  v-if="processeds.length">
              <div class="processed-item" v-for="( item , index ) in processeds" :key="index">
                  <router-link :to="{ name : 'appDemandDetail' , params : { id : item.id } }">
                      <div class="title gutter">
                          <span class="time">{{ item.created_at }}</span>
                          <div class="right status">已处理</div>
                      </div>
                      <div class="demand gutter">
                          <span>所需城市：</span>
                          <span class="citys ellipsis">
                            <span v-for="(city,i) in item.appeal_cities" :key="i">{{ city.city.city_name }}</span>
                          </span>
                          <span class="vertical-line"></span>
                          <span>推广形式：</span>
                          <span v-if="item.spread_way">{{ item.spread_way.spread_way_name }}</span>
                      </div>
                      <div class="demand-result clear gutter">
                          <div class="left">处理结果：</div>
                          <div class="overflow doubleellipsis">
                              {{ item.result }}
                          </div>
                      </div>
                  </router-link>
              </div>
            </div>
            <div class="no-data" v-else>暂无数据</div>
          </div>

        <load-more v-show="is_show" :show-loading="showLoading" :tip="loadingTip" background-color="#f0f0f0"></load-more>

        </div>
    </div>
  </div>
</template>

<script>
  import { setupWebViewJavascriptBridge } from 'src/config/tools';
  import appHead from 'src/components/appHead.vue';
  import { loadMore } from 'src/components/mixin';
  import { Swiper , SwiperItem , Tab , TabItem , LoadMore } from 'vux';
  import { getMyDemand } from 'src/service/getData';
export default {
  data () {
    return {
      status : 0 , // 处理状态
      pendings : [],  // 待处理列表
      processeds : [] , // 已处理列表
      page:1 ,
      pageSize : 10,
      showLoading : false,
      loadingTip : '正在加载...',
      end : false , // 到底了
      preventRepeatReuqest : false , // 阻止重复请求
      is_show : false,
    }
  },
  mixins : [ loadMore ] ,
  components : { appHead , Tab , TabItem , LoadMore },
  mounted(){
    let params = {
      status : 0 ,
      page : this.page,
      pageSize : this.pageSize
    };
    getMyDemand( params ).then(res => {
      this.pendings = res.result.data ;
    }) ;

    let params2 = {
      status : 2 ,
      page: this.page,
      pageSize : this.pageSize
    };
    getMyDemand( params2 ).then(res => {
      this.processeds = res.result.data ;
    }) ;

  },
  methods:{
    back(){
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('back_home', "返回首页" , function (data) {}) ;
      });
    },
    tabClick(){
      this.page = 1 ;
      this.showLoading = false;
      this.loadingTip = '正在加载...';
      this.end = false ; // 到底了
      this.preventRepeatReuqest = false ;// 阻止重复请求
      this.is_show = false;
    },
    loadingMore () {
      if (this.end) {
        return ;
      }
      //防止重复请求
      if (this.preventRepeatReuqest) {
        return ;
      }
      this.showLoading = true;
      this.preventRepeatReuqest = true;
      // 正在加载
      this.is_show = true ;
      this.showLoading = true ;
      this.page ++ ;

      if( this.status == 0 ){
        let params = {
          status : 0 ,
          page : this.page,
          pageSize : this.pageSize
        };
        getMyDemand( params ).then(res => {
          this.pendings = [ ...this.pendings , ...res.result.data ];
          // 加载完成
          this.is_show = false ;
          this.showLoading = false ;
          if( res.result.data.length < 10 ){
            this.end = true ;
            this.is_show = true ;
            this.loadingTip = '没有更多数据了';
          }
          this.preventRepeatReuqest = false;

        }) ;
      }else{
        let params2 = {
          status : 2 ,
          page: this.page,
          pageSize : this.pageSize
        };
        getMyDemand( params2 ).then(res => {

          this.processeds = [ ...this.processeds , ...res.result.data ];
          // 加载完成
          this.is_show = false ;
          this.showLoading = false ;
          if( res.result.data.length < 10 ){
            this.end = true ;
            this.is_show = true ;
            this.loadingTip = '没有更多数据了';
          }
          this.preventRepeatReuqest = false;
        }) ;
      }
    },
  }
}

</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  .mask{
    position: fixed;
    top: 0.44rem;
    left: 0.15rem;
    width: 0.8rem;
    height: 0.9rem;
    z-index: 150;
  }

  /*tab栏重置样式*/
  .vux-tab{
    position: fixed;
    top: 1.34rem;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 0.94rem;
    background-color: #fff;
  }
  .vux-tab .vux-tab-item{
    line-height: 0.94rem;
    font-size: 0.28rem;
    color: #999;
  }
  .vux-tab .vux-tab-item.vux-tab-selected{
    font-size: 0.34rem;
    color: #282A2A!important;
  }
  .no-data{
    margin: 0.4rem  0;
    text-align: center;
    @include sc(0.28rem,#999);
  }
  .tab-wraper{
    padding-top: .94rem;
  }
  .citys{
    display: inline-block;
    vertical-align: middle;
    width: 1.2rem;
  }
  .pending-item , .processed-item{
    margin-bottom: 0.2rem;
    background-color: #fff;
    > a {
      display: block;
    }
    .title{
      height: 0.9rem;
      line-height: 0.89rem;
      @include bb-1px( #ddd );
      .time{
        font-size: 0.28rem;
        color: #333;
      }
      .status {
        font-size: 0.28rem;
        color: #666;
      }
    }
    .demand {
      height: 0.9rem;
      line-height: 0.9rem;
      font-size: 0.26rem;
      color: #666;
      .vertical-line{
        display: inline-block;
        vertical-align: top;
        width: 1px;
        height: 0.4rem;
        margin: 0.25rem 0.4rem 0;
        background-color: #ddd;
      }
    }
    .demand-result{
      height: 1.2rem;
      padding: 0.3rem 0.28rem;
      font-size: 0.24rem;
      color: #666;
      background-color: #FAFAFA;
      .overflow{
        overflow: hidden;
        line-height: 0.3rem;
      }
    }
  }
</style>
