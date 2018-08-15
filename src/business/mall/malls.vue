<template lang="html">
  <div>
    <v-head isFixed="true" path="/home">
      <div slot="center-part">快速订</div>
    </v-head>
    <div>
      <section class="head-banner"></section>
       <section class="list" v-load-more="loadingMore" type="1">
          <v-fieldlist :field="item" v-for="( item , index ) in fields" :key="index"></v-fieldlist>
          <load-more v-show="is_show" :show-loading="showLoading" :tip="loadingTip" background-color="#f0f0f0"></load-more>
       </section>
    </div>
    <div v-if="noFields" class="not-find">
      <div class="bg-img"></div>
      <div class="ct">
       <p>很抱歉 ≥-≤</p>
       <p>暂无当天订的场地哦！</p>
      </div>
      <router-link class="btn" to="/home">返回首页</router-link>
    </div>


  </div>
</template>

<script>
  import vHead from 'src/components/vHead';

  import vFieldlist from 'src/components/vFieldlist';
  import { getResources } from 'src/service/getData';
  import { initDataConfig } from 'src/config/data' ;
  import { loadMore } from 'src/components/mixin';
  import { LoadMore } from 'vux' ;
  import { getStorage } from 'src/config/tools';
export default {
  data () {
    return {
      fields : [], // 场地列表
      page : 1 , // 初始页码
      showLoading : true,
      loadingTip : '正在加载...',
      end : false , // 到底了
      preventRepeatReuqest : false , // 阻止重复请求
      is_show : true ,
      total : 1, // 资源总数
      noFields : false
    }
  },
  components: { vFieldlist , LoadMore , vHead },
  mixins : [ loadMore ] ,
  created(){
    this.city_id = getStorage('cityId') || +this.$route.query.city_id || 90 ;
  },
  methods : {
    init(){
      let params = {
        page : this.page ,
        pageSize : 10 ,
        self_support : 1 ,
        city_id : this.city_id
      };
      console.log(params)
      let obj = initDataConfig(params) ;
      getResources( obj ).then( res => {
        // 去掉加载的小loading
        this.showLoading = false ;
        this.is_show = false ;
        this.fields = res.result ;
        this.total = res.total ;
        if(!res.result.length){
          this.noFields = true ;
        }else{
          this.noFields = false ;
        }
      }).catch(err => {
        // 去掉加载的小loading
        this.showLoading = false ;
        this.is_show = false ;
        this.$vux.toast.text(err.msg);
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
      let params = {
        page : this.page ,
        pageSize : 10 ,
        self_support : 1,
        city_id : this.city_id
      };
      let obj = initDataConfig(params) ;
      getResources( obj ).then( res => {
        this.total = res.total ;
        this.fields = [ ...this.fields , ...res.result ];
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
  },
  mounted(){
    this.init();
  }
}

</script>

<style lang="scss" scoped>
  @import "../../style/mixin";
  .head-banner{
    @include wh(100% ,2.2rem);
    @include bg-image('../../images/banner_kuaisuding_three_four');
  }
  .list{
    &.mb{
      padding-bottom: 1.2rem;
    }
  }
  .not-find{
    position: fixed;
    top: 0.9rem;
    left: 0;
    right: 0;
    bottom: 1rem;
    width: 100%;
    background-color: #fff;
    .bg-img{
      @include wh(2.8rem,2.8rem);
      margin: 1rem auto 0.1rem;
      @include bg-image('../../images/emptystates_shopself_three');
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

