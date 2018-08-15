<template lang="html">
  <div>
    <v-head goBack="true" isFixed="true">
      <div slot="center-part">评价详情({{people}}人评价)</div>
    </v-head>
    <section>
      <ul class="score-box">
        <li class="score-item">
          <span class="com-left">综合评分</span>
          <rater :disabled="true" v-model="score"></rater>
        </li>
        <li class="score-item">
          <span class="com-left">人流量</span>
          <rater :disabled="true" v-model="score_of_visitorsflowrate"></rater>
        </li>
        <li class="score-item">
          <span class="com-left">物业配合度</span>
          <rater :disabled="true" v-model="score_of_propertymatching"></rater>
        </li>
        <li class="score-item">
          <span class="com-left">用户参与度</span>
          <rater :disabled="true" v-model="score_of_userparticipation"></rater>
        </li>
        <li class="score-item">
          <span class="com-left">目标完成度</span>
          <rater :disabled="true" v-model="score_of_goalcompletion"></rater>
        </li>
      </ul>
    </section>
    <section class="list" v-show="list.length">
      <ul class="list-content" v-load-more="loadingMore" type="1">
        <li class="comment-item border-1px" v-for="( comment , index ) in list" :key="index">
          <div class="title">
            <div>{{ comment.name }}</div>
            <div class="star">
              <star :score="comment.score" :size="24"></star>
            </div>
          </div>
          <div class="info">
            <div class="time">{{ comment.reviewed_at }}</div>
            <div><span>现场人流量：</span><span class="number-people">{{ comment.people_flow || 0 }}</span></div>
          </div>
          <div class="content">
            <p v-if="comment.content">{{ comment.content }}</p>
            <div class="imgbox" v-if="comment.images.length">
              <img v-lazy="item" v-for="(item , index) in comment.images" alt="评论图片">
            </div>
          </div>
        </li>
        <load-more v-show="is_show" :show-loading="showLoading" :tip="loadingTip" background-color="#f0f0f0"></load-more>
      </ul>
    </section>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead';
  import star from 'src/components/star';
  import { loadMore } from 'src/components/mixin';
  import { Rater , LoadMore } from 'vux';
  import { getCommentsList } from 'src/service/getData';
export default {
  data () {
    return {
      page : 1 , // 页码
      score : 5 , // 综合评分  默认5星好评
      score_of_visitorsflowrate: 5 , // 人流量评分
      score_of_propertymatching: 5 , // 物业配合度
      score_of_userparticipation: 5 ,//  用户参与度
      score_of_goalcompletion: 5 , // 目标完成度
      people : 0 ,// 评价人数
      list : [] ,// 评价列表

      showLoading : false,
      loadingTip : '正在加载...',
      end : false , // 到底了
      preventRepeatReuqest : false , // 阻止重复请求
      is_show : false,
    }
  },
  components:{
    Rater,
    vHead,
    star,
    LoadMore
  },
  mixins : [ loadMore ] ,
  mounted(){
    this.$vux.loading.show({ text : 'loading' });
   this.init();
  },
  methods : {
    init(){
      let id = this.$route.params.id ;
      let page = this.page ;
      getCommentsList( id , page ).then( res => {
        this.$vux.loading.hide();
        this.people                     = res.detailScore.count_of_composite_score;
        this.score                      = res.detailScore.composite_score;
        this.score_of_visitorsflowrate  = res.detailScore.score_of_visitorsflowrate;
        this.score_of_propertymatching  = res.detailScore.score_of_propertymatching;
        this.score_of_userparticipation = res.detailScore.score_of_userparticipation;
        this.score_of_goalcompletion    = res.detailScore.score_of_goalcompletion;
        this.list                       = res.result ;

      })
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
      let id = this.$route.params.id ;
      let page = this.page ;
      getCommentsList( id , page ).then( res => {
        this.list = [ ...this.list , ...res.result ];
        // 加载完成
        this.is_show = false ;
        this.showLoading = false ;
        if( res.result.length < 10 ){
          this.end = true ;
          this.is_show = true ;
          this.loadingTip = '没有更多数据了';
        }
        this.preventRepeatReuqest = false;
      })
    },
  }
}

</script>
<style lang="scss">
  @import "../../style/mixin";
  .vux-rater{
    margin:0.2rem 0 0.2rem 0.8rem;
    .vux-rater-box{
      font-size: 0 !important;
      width: 0.36rem!important;
      height: 0.36rem!important;
      line-height: 0.6rem!important;
      margin-right: 0.2rem !important;
      @include bg-image('../../images/ic_unselectstar_two_six');
      &.is-active{
        font-size: 0 !important;
        width: 0.36rem!important;
        height: 0.36rem!important;
        margin-right: 0.2rem !important;
        @include bg-image('../../images/ic_selectstar_two_six');
      }
      &:last-child{
        margin-right: 0 !important;
      }
    }
  }
</style>
<style lang="scss" scoped>
  @import "../../style/mixin";

  .score-box{
    padding: 0 0.24rem;
    background-color: #fff;
    .score-item{
      line-height: 0.76rem;
      font-size: 0;
      overflow: hidden;
      .com-left{
        display: inline-block;
        vertical-align: top;
        width: 1.4rem;
        font-size: 0.26rem;
      }
      .com-text{
        font-size: 0.26rem;
        color: #666;
      }
    }
  }
  .list{
    margin-top: 0.2rem;
    padding-bottom: 0.4rem;
    background-color: #fff;
    .list-content{
      padding: 0 0.24rem;
      .comment-item{
        overflow: hidden;
        @include bb-1px(#e8e8e8);
        .title{
          display: flex;
          justify-content: space-between;
          margin-top: 0.3rem;
          font-size: 0.26rem;
          color: #666;
        }
        .info{
          display: flex;
          justify-content: space-between;
          margin: 0.3rem 0 0.19rem 0;
          font-size: 0.24rem;
          color: #999;
          .number-people{
            color: #000;
            font-size: 0.22rem;
          }
        }
        .content{
          p{
            margin-bottom: 0.19rem;
            line-height: 0.48rem;
            font-size: 0.26rem;
            color: #1E1E1E;
          }
          .imgbox{
            display: flex;
            margin-bottom: 0.3rem;
            >img{
              @include wh( 1.6rem , 1.6rem );
              margin-right: 0.2rem;
              &:last-child{
                margin-right: 0;
              }
            }
          }
        }
      }
    }
  }
</style>
