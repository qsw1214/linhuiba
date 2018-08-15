<template lang="html">
  <div>
    <v-head path="/admin/profile" isFixed="true">
      <div slot="center-part">我的订单</div>
    </v-head>
    <nav class="nav">
      <tab :line-width=2 active-color='#0085E3' custom-bar-width='0.86rem'>

        <tab-item class="vux-center" :selected="status===item.status" v-for="(item, index) in navlist" :key="index">
          <router-link :to="{ path : $route.path, query : { status : item.status } }" :style="{ display:'block' }" replace>
            {{item.text}}
          </router-link>
        </tab-item>
      </tab>
    </nav>
    <section class="list" v-load-more="loadingMore" type="1">
    <!--根据不同的状态显示不同的列表-->
      <div class="all" v-if="status=='all'">
        <div v-if="allList.length">
            <div class="all-item" v-for="(item , index) in allList" :key="index">
        <!--根据列表项不同的状态使用不同的模板-->

            <div v-if ="item.status=='submitted'">
              <v-ordersubmitted :orderitem="item"></v-ordersubmitted>
            </div>
            <div v-else-if ="item.status=='paid'">
              <v-orderpaid :orderitem="item"></v-orderpaid>
            </div>
            <div v-else-if ="item.status=='approved'">
              <v-orderapproved :orderitem="item"></v-orderapproved>
            </div>
            <div v-else-if ="item.status=='canceled'">
              <v-ordercanceled :orderitem="item"></v-ordercanceled>
            </div>
            <div v-else    ="item.status=='finished'">
              <v-orderfinished :orderitem="item"></v-orderfinished>
            </div>
          </div>
        </div>
        <div class="no-data" v-else>
          暂无数据
        </div>


      </div>




      <!--根据导航不同的状态使用不同的模板-->
      <div v-else-if ="status=='submitted'">
          <!--循环体-->
        <div v-if="allList.length">
          <v-ordersubmitted :orderitem="item" v-for="(item , index) in allList" :key="index"></v-ordersubmitted>
        </div>
        <div class="no-data" v-else>
          暂无数据
        </div>

      </div>
      <div v-else-if ="status=='paid'">
          <!--循环体-->
        <div v-if="eachList.length">
          <v-orderpaid :orderitem="item" small="true" v-for="(item,index) in eachList" :key="index"></v-orderpaid>
        </div>
        <div class="no-data" v-else>
          暂无数据
        </div>

      </div>
      <div v-else-if ="status=='approved'">
          <!--循环体-->
        <div v-if="eachList.length">
          <v-orderapproved :orderitem="item" small="true" v-for="(item,index) in eachList" :key="index"></v-orderapproved>
        </div>
        <div class="no-data" v-else>
          暂无数据
        </div>
      </div>
      <div v-else-if ="status=='canceled'">
          <!--循环体-->
        <div v-if="eachList.length">
          <v-ordercanceled small="true" :orderitem="item" v-for="(item,index) in eachList" :key="index"></v-ordercanceled>
        </div>
        <div class="no-data" v-else>
          暂无数据
        </div>

      </div>
      <div v-else    ="status=='finished'">
          <!--循环体-->
        <div v-if="eachList.length">
          <v-orderfinished small="true" :orderitem="item" v-for="(item,index) in eachList" :key="index"></v-orderfinished>
        </div>
        <div class="no-data" v-else>
          暂无数据
        </div>
      </div>
      <load-more v-show="is_show" :show-loading="showLoading" :tip="loadingTip" background-color="#f0f0f0"></load-more>
    </section>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead' ;
  import vOrderapproved from 'src/components/vOrderapproved' ;
  import vOrdercanceled from 'src/components/vOrdercanceled' ;
  import vOrderfinished from 'src/components/vOrderfinished' ;
  import vOrderpaid from 'src/components/vOrderpaid' ;
  import vOrdersubmitted from 'src/components/vOrdersubmitted' ;
  import { Tab , TabItem , Swiper , SwiperItem , LoadMore } from 'vux' ;
  import { getOrderList , getSmallOrderList } from 'src/service/getData' ;
  import { loadMore } from 'src/components/mixin';
export default {
  data () {
    return {
      status : 'all' , // 选中全部
      page : 1 , // 页码
      pageSize : 10 , // 条数
      navlist : [
        { status : 'all' ,       text : '全部'  },
        { status : 'submitted' , text : '待支付'},
        { status : 'paid' ,      text : '待审核'},
        { status : 'approved' ,  text : '进行中'},
        { status : 'canceled' ,  text : '已拒绝'},
        { status : 'finished' ,  text : '待评价'}
      ], // 导航
      allList   : [
        { status : 'all' ,       text : '全部'  },
        { status : 'submitted' , text : '待支付'},
        { status : 'paid' ,      text : '待审核'},
        { status : 'approved' ,  text : '进行中'},
        { status : 'canceled' ,  text : '已拒绝'},
        { status : 'finished' ,  text : '待评价'}
      ] , // 全部和待支付列表数据
      eachList  : [] , // 待审核，进行中，已拒绝，待评价列表数据

      showLoading : false,
      loadingTip : '正在加载...',
      end : false , // 到底了
      preventRepeatReuqest : false , // 阻止重复请求
      is_show : false,
    }
  },
  mixins : [ loadMore ] ,
  components : {
    vHead ,
    Tab ,
    TabItem ,
    vOrderapproved,
    vOrdercanceled,
    vOrderfinished,
    vOrderpaid,
    vOrdersubmitted,
    LoadMore
  },
  created(){
    this.$vux.loading.show({
      text : 'loading...'
    });
    this.status = this.$route.query.status || 'all' ;
  },
  mounted(){
    if( this.status == 'all' || this.status == 'submitted' ){
      this.init() ;
    }else{
      this.initSmall() ;
    }
  },
  methods : {
    init(){
      let params = {
        status : this.status,
        page : this.page ,
        pageSize : this.pageSize
      };
      getOrderList( params ).then( res => {
        this.allList = res.result ;
        this.$vux.loading.hide();
      }).catch(err => {})
    },
    initSmall(){
      let params = {
        status : this.status,
        page : this.page ,
        pageSize : this.pageSize
      };
      getSmallOrderList( params ).then( res => {
        this.eachList = res.result ;
        console.log(this.eachList)
        this.$vux.loading.hide();
      }).catch(err => {})
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
      if( this.status == 'all' || this.status == 'submitted' ){
        let params = {
          status : this.status,
          page : this.page ,
          pageSize : this.pageSize
        };
        getOrderList( params ).then( res => {
          this.allList = [ ...this.allList , ...res.result ];
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
      }else{
        let params = {
          status : this.status,
          page : this.page ,
          pageSize : this.pageSize
        };
        getSmallOrderList( params ).then( res => {
          this.eachList = [ ...this.eachList , ...res.result ];
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
      }

    },
  }
}

</script>

<style lang="scss">
  .vux-tab{
    height: 1.1rem !important;
    .vux-tab-item{
      line-height: 0.8rem !important;
      font-size: 0.26rem !important;
    }
  }
</style>
<style lang="scss" scoped>
  @import '../../style/mixin';
  .nav{
    position: fixed;
    top: 0.9rem ;
    left: 0;
    z-index: 2;
    width: 100%;
  }
  .list{
    padding-top: 0.8rem;
    background-color: $bgc;
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
