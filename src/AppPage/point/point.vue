<template lang="html">
  <div class="point">

      <header class="P-header">

        <router-link :to="{path:'/appArticle/65'}" class="P-help-rule">
          <x-icon  type="ios-help-outline" color="#ffffff" size="0.4rem"></x-icon>
            积分使用规则
        </router-link>
        <div v-if='userProfile!=null' class="P-info">
          <img class="P-avatar" v-lazy="userProfile.avatar||''" />
          <div class="P-num">
            <span class="num-point">{{userProfile.consumption_point}}</span>
            <span class="num-discount">邻汇吧积分(可抵扣{{userProfile.consumption_point*5/1000 | twoPoint}}元)</span>
          </div>
        </div>
      </header>
      <section class="P-main">
        <p class="P-tit">积分明细</p>
        <ul class="P-list"  v-load-more="loadingMore" v-if="pointList.length" type="1">
            <li class="P-item" v-for="(item,index) in pointList" >
              <div class="item-top">
                <span>{{operationType[item.operation_type]}}</span>
                <span :class="item.increment>0?'add':'reduce'">{{item.increment>0?'+':''}}{{item.increment}}</span>
              </div>
              <div class="item-bottom">
                <span>场地名：{{item.title}}</span>
                <span>{{item.created_at}}</span>
              </div>
            </li>
        </ul>
          <load-more v-show="is_show" :tip="loadingTip" :show-loading="showLoading" ></load-more>
      </section>
  </div>
</template>

<script>

import { LoadMore, Icon } from 'vux'
import { getPoint , userInfo } from 'src/service/getData';
import { twoPoint} from 'src/filters'
import { loadMore } from 'src/components/mixin'
export default {
  data() {
    return {
      pointList: [], // 文章列表
      data:{
        page:1,
        pageSize:10
      },
       operationType :[
        "订单完成增加积分",
        "订单完成增加积分",
        "下单使用积分抵扣",
        "拒绝订单积分回退",
        "反馈问题积分奖励",
        "订单评价积分奖励"
      ],
      showLoading: false,
      loadingTip: '正在加载...',
      end: false, // 到底了
      preventRepeatReuqest: false, // 阻止重复请求
      is_show: false ,

      userProfile : null
    }
  },
  components: {  Icon , LoadMore},
   mixins: [loadMore],
  filters: {
   twoPoint
  },

  mounted() {
    userInfo().then(res => {
      this.userProfile = res.result;
    });
    this.initData()
  },
  methods: {
    initData() {
      this.data.page = 1;
      this.pointList=[];
       getPoint(this.data).then(res=>{
         this.pointList = res.result.data;
       })
    },
    loadingMore() {
      if (this.end) {
        return;
      }
      //防止重复请求
      if (this.preventRepeatReuqest) {
        return;
      }
      this.showLoading = true;
      this.preventRepeatReuqest = true;

      // 正在加载
      this.is_show = true;
      this.showLoading = true;

      this.data.page++;

      getPoint(this.data)
        .then(res => {
          this.pointList = [...this.pointList, ...res.result.data];
          // 加载完成
          this.is_show = false;
          this.showLoading = false;

          if (res.result.data.length < this.data.pageSize) {
            this.end = true;
            this.is_show = true;
            this.loadingTip = '没有更多数据了';
          }
          this.preventRepeatReuqest = false;
        })
    }
  }

}

</script>

<style lang="scss" scoped>
@import "../../style/mixin";
.point {
  // background: $bgc;
  .P-header {
    @include wh(100%, 1.92rem);
    @include sc(0.24rem, #fff);
    background: linear-gradient(#09a2fe, #3984fe);
    position: relative;
    padding: 0 0.28rem;
    display: flex;
    align-items: center;
    .P-info {
      display: flex;
      align-items: center;
      .P-avatar {
        border-radius: 50%;
        margin-right: 0.2rem;
        @include wh(1.2rem, 1.2rem);
      }
      .P-num {
        display: flex;
        flex-direction: column;
        span {
          &.num-point {
            line-height: 0.8rem;
            text-indent: 0.8rem;
            @include sc(0.4rem, #fff);
            @include wh(auto, 0.8rem);
          }
          &.num-discount {
            line-height: 0.5rem;
            @include sc(0.24rem, #ddf0ff);
            @include wh(auto, 0.5rem);
          }
        }
      }
    }
    .P-help-rule {
      position: absolute;
      top: 0.2rem;
      right: 0;
      z-index: 2;
      @include wh(2.2rem, 0.54rem);
      display: flex;
      align-items: center;
      color:#fff;
      .vux-x-icon {
        fill: #fff;
        margin-right: 0.1rem;
      }
    }
  }
  .P-main {
    .P-tit {
      line-height: 0.68rem;
      text-indent: 0.3rem;
      @include wh(100%, 0.68rem);
      @include sc(0.28rem, #888);
    }
    .P-list {
      background: #fff;
      padding: 0 0.28rem;
      .P-item {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        @include wh(100%, 1.6rem);
        padding: 0.2rem 0 0.1rem;
        @include bb-1px(#ddd);
        &:last-child {
          @include bb-1px(transparent);
        }
        div {
          display: flex;
          justify-content: space-between;
          span {
            @include one-ellipsis();
            &:first-child {
              flex: 1;
            }
            &.add{
              color:$red;
            }
          }
          &.item-top {
            @include sc(0.28rem, #333);
          }
          &.item-bottom {
            @include sc(0.26rem, #888);
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" >
@import "../../style/mixin";

body,
html {
  background: $bgc;
}
</style>

