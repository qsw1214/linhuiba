<template lang="html">
  <div>
    <div class="mask" @click="back"></div>
    <app-head isFixed="true">
      <div slot="center-part">提交成功</div>
    </app-head>
    <div class="box">
        <div class="bg-img"></div>
        <h3>需求提交成功</h3>
        <p>稍后工作人员将联系你</p>
    </div>
    <div class="btn-box">
      <div class="btn go-mydemand">
        <router-link to="/appMyDemand" @click="viewDemand">查看需求</router-link>
      </div>
      <div class="btn go-home" @click="back">
        <span>返回首页</span>
      </div>
    </div>

    <div class="list" v-load-more="loadingMore" type="1">
      <div class="title">为你推荐 <span class="txt" v-if=" $route.query.city || $route.query.field_type ">（根据您发布需求中“{{ $route.query.city }}”、“{{ $route.query.field_type }}”推荐）</span></div>
      <div class="wraper">
        <div class="item" v-for="( item , index) in list" :key="index" @click.stop="itemClick(item.sid)">
          <div class="img-box">
            <img v-lazy="item.img" :data-srcset="item.img | half" alt=" ">
          </div>
          <div class="content">
            <div class="name ellipsis">{{ item.name }}</div>
            <div class="info">
              <div class="price">
                <span class="price-pre">¥</span><span class="price-num">{{ item.original_min_price/100 }}</span><span> / </span><span>{{ item.unit }}</span>
              </div>
              <div class="number-people">人流量：<span>{{ item.number_of_people }}</span></div>
            </div>
          </div>
        </div>
      </div>

      <load-more v-show="is_show" :show-loading="showLoading" :tip="loadingTip" background-color="#f0f0f0"></load-more>
    </div>
  </div>
</template>

<script>
import { setupWebViewJavascriptBridge } from 'src/config/tools';
import appHead from 'src/components/appHead';
import { getAppealMatch } from 'src/service/getData';
import { half } from 'src/filters/index';
import { loadMore } from 'src/components/mixin';
import { LoadMore  } from 'vux' ;
export default {
  data () {
    return {
      list : [] ,
      page : 1 ,
      pageSize : 10,
      id : this.$route.query.id ,

      showLoading : false,
      loadingTip : '正在加载...',
      end : false , // 到底了
      preventRepeatReuqest : false , // 阻止重复请求
      is_show : false,
    }
  },
  components: {
    appHead , LoadMore
  },
  mixins : [ loadMore ] ,
  filters : { half },
  mounted(){
    let p = {
      page : this.page ,
      pageSize : this.pageSize ,
      appeal_id : this.id
    };
    getAppealMatch(p).then( res => {
      this.list = res.result ;
    }).catch( err => {
      this.$vux.alert.show({
        title : '' ,
        content : 'ID参数缺失,无法为你推荐更多'
      })
    });
  },
  methods:{
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
        appeal_id : this.id
      };
      getAppealMatch( params ).then( res => {
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
      })
    },
    viewDemand(){
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('viewDemand', "查看需求" , function (data) {}) ;
      });
    },
    back(){
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('back_home', "返回首页" , function (data) {}) ;
      });
    },
    itemClick( id ){
      setupWebViewJavascriptBridge(function(bridge) {
        bridge.callHandler('gotoFieldDetail', id , function (data) {}) ;
      });
    }
  }
}

</script>

<style lang="scss" scoped>
    @import "../../style/mixin";
    .mask{
      position: fixed;
      top: 0.44rem;
      left: 0.15rem;
      width: 0.8rem;
      height: 0.9rem;
      z-index: 150;
    }
    .box {
      overflow: hidden;
      background-color: #fff;
      .bg-img{
        @include wh(2.02rem,2.02rem);
        margin:0.44rem auto 0.26rem;
        @include bg-image( '../../images/ic_Submit_successfully');
      }
      h3{
        font-size: .36rem;
        margin-bottom:0.2rem;
        text-align: center;
      }
      p{
        @include sc(0.26rem,#A9A9A9);
        text-align: center;
      }
    }
    .btn-box{
      padding:0.6rem 0 0.42rem;
      display: flex;
      justify-content: center;
      background-color: #fff;
      .btn{
        @include wh(2.36rem,0.64rem);
        margin:0 0.1rem;
        text-align: center;
        line-height:0.64rem;
        font-size: 0.28rem;
        border-radius:0.08rem;
        &.go-mydemand{
          border:1px solid #999;
        }
        &.go-home{
          background:$mainColor;
          color:#fff;
        }
      }

    }
    .list{
      margin-top: 0.2rem;
      background-color: #f0f0f0;
      .title{
        padding: 0 0.24rem;
        line-height: 0.94rem;
        background-color: #fff;
        @include sc(0.3rem,$fontColor);
        .txt{
          @include sc(0.24rem,#999);
        }
      }
      .wraper{
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 0 0.24rem;
        .item{
          display: block;
          width: 3.42rem;
          margin-bottom: 0.16rem ;
          background-color: #fff;
          .img-box {
            @include wh(100%,2.72rem);
            >img{
              width: 100%;
            }
          }
          .content{
            padding: 0.2rem 0.1rem;
            .name{
              @include sc(0.28rem,$fontColor);
            }
            .info{
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              margin-top: 0.2rem;
              .price{
                @include sc(0.22rem,#999);
                .price-pre{
                  @include sc(0.22rem,$red);
                }
                .price-num{
                  @include sc(0.28rem,$red);
                }
              }
              .number-people{
                @include sc(0.2rem,#999);
              }
            }
          }
        }
      }
    }

</style>
