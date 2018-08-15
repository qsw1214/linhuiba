<template lang="html">
  <div>
    <div class="wraper">
      <div class="title">
        <div>
          <span class="pre" @click.stop="preClick"> < </span>
          <span class="com"> {{ year }} </span>
          <span class="pre" @click.stop="nextClick"> > </span>
        </div>
        <div>
          <span class="com">累计收入：</span>
          <span class="price">50000.0</span>
        </div>
      </div>
      <div id="main"></div>
    </div>
    <div class="list" v-load-more="loadingMore" type="1" v-if="orderList.length">
      <div class="tit">收款明细</div>
      <div class="con">
        <div class="item" v-for="( item , index ) in orderList" :key="index">
          <div class="info">
            <span class="info-tit">成功订单</span>
            <span class="info-tit">+{{ item.income/100 }}</span>
          </div>
          <div class="order-num">
            <span>订单号：{{ item.order_num }}</span>
            <span>{{ item.created_at }}</span>
          </div>
        </div>

        <load-more v-show="is_show" :show-loading="showLoading" :tip="loadingTip" background-color="#f0f0f0"></load-more>
      </div>
    </div>
    <div class="no-data" v-else>暂无数据</div>
  </div>
</template>

<script>
  import echarts from 'echarts' ;
  import { getProOrderList } from 'src/service/getData';
  import { loadMore } from 'src/components/mixin';
  import { LoadMore } from 'vux' ;
export default {
  data () {
    return {
      orderList : [] ,// 订单列表
      page :1,
      pageSize : 10 ,
      incomeYear : 0 ,
      year : new Date().getFullYear(),

      showLoading : false,
      loadingTip : '正在加载...',
      end : false , // 到底了
      preventRepeatReuqest : false , // 阻止重复请求
      is_show : false ,
    }
  },
  mixins : [ loadMore ] ,
  components: { LoadMore },
  mounted(){
    this.init();
  },
  methods:{
    init(){
      let p = {
        page : this.page ,
        pageSize : this.pageSize ,
        year : this.year
      };
      getProOrderList( p ).then(res => {
        this.incomeYear = res.result.income_of_year / 100 ;
        this.orderList = res.result.field_order ;
        let income_data = [];
        let income_of_month = res.result.income_of_month;
        for( let month of income_of_month ){
          let month_item = parseInt( month.income_of_month / 100) / 10000;
          income_data.push(month_item);
        }
        this.appendEcharts(income_data);
      }).catch(err => { console.log( err ) })
    },
    appendEcharts( data ){
      let myChart = echarts.init( document.getElementById('main') );
      myChart.showLoading({
        text: '正在努力的读取数据中...',    //loading话术
      });
      let option = {
        color: [
          '#fff'
        ],
        legend: {                                   // 图例配置
          padding: 5,                             // 图例内边距，单位px，默认上下左右内边距为5
          itemGap: 10,                            // Legend各个item之间的间隔，横向布局时为水平间隔，纵向布局时为纵向间隔
          data: []
        },
        tooltip: {                                  // 气泡提示配置
          trigger: 'item',                        // 触发类型，默认数据触发，可选为：'axis'
        },
        xAxis:                                    // 直角坐标系中横轴数组
        {
          type: 'category',                   // 坐标轴类型，横轴默认为类目轴，数值轴则参考yAxis说明
          data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
          axisLabel : {
            textStyle: {
              color : '#fff',
              fontSize : '13px',
            }
          },
          axisLine:{
            lineStyle:{
              color:'rgba(255,255,255,0.3)',
              width: 1,//这里是为了突出显示加上的
              type: 'dotted'

            }
          }
        },
        yAxis:{
          type: 'value',                      // 坐标轴类型，纵轴默认为数值轴，类目轴则参考xAxis说明
          //boundaryGap: [0, 10],            // 坐标轴两端空白策略，数组内数值代表百分比
          min: [0],
          max: [10],
          splitNumber: 2,// 数值轴用，分割段数，默认为5
          axisLabel : {
            formatter: '{value} w',
            textStyle : {
              color : '#fff',
              fontSize : '13px'
            }
          },
          axisLine:{
            lineStyle:{
              color:'rgba(255,255,255,0)',
              width: 0,//这里是为了突出显示加上的
            }
          },
          splitLine : {
            lineStyle:{
              color:'rgba(255,255,255,0.3)',
              width: 1,//这里是为了突出显示加上的
              type: 'dotted'
            }
          }
        },
        series: [
          {
            name: '收入',                        // 系列名称
            type: 'line',                       // 图表类型，折线图line、散点图scatter、柱状图bar、饼图pie、雷达图radar
            data: data,
            symbol:'none',  //这句就是去掉点的
            smooth:true  //这句就是让曲线变平滑
          }
        ]
      };
      myChart.setOption(option);
      myChart.hideLoading();
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
      let params = {
        page : this.page ,
        pageSize : this.pageSize ,
        year : this.year
      };

      getProOrderList( params ).then( res => {
        this.orderList = [ ...this.orderList , ...res.result.field_order ];
        // 加载完成
        this.is_show = false ;
        this.showLoading = false ;
        if( res.result.field_order.length < 10 ){
          this.end = true ;
          this.is_show = true ;
          this.loadingTip = '没有更多数据了';
        }
        this.preventRepeatReuqest = false;
      })
    },
    preClick(){
      this.year -- ;
      if( this.year > 2015 ){
        this.init();
      }else{
        this.year = 2015 ; // 公司成立于2015年
      }
    },
    nextClick(){
      this.year ++ ;
      if( this.year <= new Date().getFullYear() ){
        this.init();
      }else{
        this.year = new Date().getFullYear() ;
      }
    }
  }
}

</script>

<style lang="scss" scoped>
  @import "../../style/mixin";
  .wraper{
    padding: 0 0.24rem;
    background-image: linear-gradient(to bottom , #09A2Fe ,#3984FE);
    .title{
      display: flex;
      justify-content: space-between;
      line-height: 0.8rem;
      border-bottom: 1px solid #76b8ff;
      .com{
        @include sc(0.28rem,#fff)
      }
      .pre{
        @include sc(0.38rem,#fff)
      }
      .price{
        @include sc(0.4rem,#fff)
      }
    }
    #main{
      height: 4rem;
    }
  }
  .list{
    padding-bottom: 0.2rem;
    background-color: #fff;
    .tit{
      padding: 0 0.24rem;
      line-height: 0.9rem;
      @include sc(0.32rem ,#666);
      background-color: #eee;
    }
    .con{
      padding: 0 0.24rem;
      .item{
        padding: 0.4rem 0;
        border-bottom: 1px solid #ddd;
        background-color: #fff;
        .info{
          display: flex;
          justify-content: space-between;
          .info-tit{
            @include sc(0.28rem,#333);
          }
        }
        .order-num{
          display: flex;
          justify-content: space-between;
          margin-top: 0.3rem;
          @include sc(0.26rem,#666);
        }
        &:nth-last-child(2){
          border-bottom: 0 none;
        }
      }
    }

  }
  .no-data{
    padding-top: 0.4rem ;
    text-align: center;
    @include sc(0.28rem,#999);
  }
</style>
