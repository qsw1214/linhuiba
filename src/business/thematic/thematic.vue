<template lang="html">
  <div>
    <v-head isFixed="true" goBack="true">
      <div slot="center-part">特色主题展</div>
    </v-head>
    <section class="thematic-list" v-if="articles.length" v-load-more="loadingMore" type="1">
      <div v-for="(item,index) in articles" :key="index">
        <a :href="item.origin" class="item-link" v-if="item.origin">
          <img v-lazy="item.pic_url" alt="a">
          <div class="tit ellipsis">{{ item.name }}</div>
        </a>
        <router-link class="item-link" :to="{ name : 'thematicDetail' , params : { id : item.id } }" v-else>
          <img v-lazy="item.pic_url" alt="a">
          <div class="tit ellipsis">{{ item.name }}</div>
        </router-link>
      </div>
      <load-more v-show="is_show" :show-loading="showLoading" :tip="loadingTip" background-color="#e8e8e8"></load-more>
    </section>
    <section v-if="notheme" class="not-find">

      <div class="bg-img"></div>
      <div class="ct">
       <p>很抱歉 ≥-≤</p>
       <p>暂时没有找到你想要的东西哦！</p>
      </div>
      <router-link class="btn" to="/home">返回首页</router-link>

    </section>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead.vue';
  import { getThemenShow } from 'src/service/getData';
  import { LoadMore } from 'vux';
  import { loadMore } from 'src/components/mixin';
export default {
  data () {
    return {
      page : 1 ,
      pageSize : 10 ,
      articles : [] ,
      notheme : false ,
      showLoading : false,
      loadingTip : '正在加载...',
      end : false , // 到底了
      preventRepeatReuqest : false , // 阻止重复请求
      is_show : false,
    }
  },
  mixins : [ loadMore ] ,
  components: {
    vHead , LoadMore
  },
  mounted(){
    let p = {
      page : this.page ,
      pageSize : this.pageSize ,
      article_type_id : 19
    };
    getThemenShow( p ).then(res => {
      this.articles = res.result ;
      if(!res.result.length){
        this.notheme = true ;
      }else{
        this.notheme = false ;
      }
    }).catch(err => {});
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
      let p = {
        page : this.page ,
        pageSize : this.pageSize ,
        article_type_id : 19
      };
      getThemenShow( p ).then(res => {
        this.articles = [ ...this.articles , ...res.result ];
        // 加载完成
        this.is_show = false ;
        this.showLoading = false ;
        if( res.result.length < this.pageSize ){
          this.end = true ;
          this.is_show = true ;
          this.loadingTip = '没有更多数据了';
        }
        this.preventRepeatReuqest = false;
      }).catch(err => {});
    }
  }
}

</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  .thematic-list{
    padding: 0.24rem 0.24rem 0;
    background-color: #fff;
    .item-link{
      display: block;
      img{
        @include wh(100%,auto);
      }
      .tit{
        line-height: 0.7rem;
        border-bottom: 1px solid #e8e8e8;
        margin-bottom: 0.2rem;
        font-size: 0.3rem;
        color: $fontColor;
      }
      &:last-child{
        .tit{
          border-bottom: 0 none;
        }
      }
    }
  }
  .not-find{
    position: fixed;
    top: 0.9rem;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    .bg-img{
      @include wh(2.8rem,2.8rem);
      margin: 1rem auto 0.1rem;
      @include bg-image('../../images/emptystates_serviceprovider_three');
    }
    .ct{
      line-height: 0.54rem;
      @include sc(0.3rem,#999)
    }
    .btn{
      display: block;
      @include wh(2.42rem,0.72rem);
      margin: 0.4rem auto;
      text-align: center;
      line-height: 0.7rem;
      border: 1px solid $mainColor;
      border-radius: 0.36rem;
      color: $mainColor;
    }
  }
</style>
