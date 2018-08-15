<template lang="html">
  <div>
    <v-head path="/admin/profile" isFixed="true">
      <div slot="center-part">我的关注</div>
    </v-head>
    <section  v-load-more="loadingMore" type="1">
      <div class="care-item" v-for="( item , index ) in careList" :key="index" v-if="item.resource_type != 2">
        <div class="care-box border-1px">
          <router-link :to="{ name : 'fieldsDetail' , params : { id : item.target_id } , query:{ id : item.resource_type } }">
              <div class="img-box">
                <img v-lazy="item.pic_url" :data-srcset="item.pic_url | small" :alt="item.field_name">
                <v-label :labelText="item.resource_type == 1 ? item.field_type : item.resource_type == 3 ? item.activity_type : ''"></v-label>
                <!--<div class="type" v-show="item.resource_type == 1 || item.resource_type == 3">{{ item.field_type }}</div>-->
              </div>
          </router-link>
          <div class="text-content">
            <div class="title ellipsis">{{ item.name }}</div>
            <div class="address ellipsis">{{ item.detail_address }}</div>
            <div class="price">
              <span class="price-pre">￥</span><span class="price-num">{{ (item.fixed_price /100) | twoPoint }}</span>
            </div>
          </div>
          <div class="care" @click="cancle( item.target_id )"></div>
        </div>
      </div>
      <load-more v-show="is_show" :show-loading="showLoading" :tip="loadingTip" background-color="#e8e8e8"></load-more>
    </section>
    <section v-if="!total" class="null-data">
        <span>暂无数据</span>
    </section>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead';
  import vLabel from 'src/components/vLabel';
  import { getMycare , cancleCare } from 'src/service/getData';
  import { twoPoint , small } from 'src/filters/index';
  import { LoadMore } from 'vux' ;
  import { loadMore } from 'src/components/mixin';
export default {
  data () {
    return {
      params : {
        page : 1,
        pageSize : 10
      },
      careList : [], // 列表数据

      showLoading : true,
      loadingTip : '正在加载...',
      end : false , // 到底了
      preventRepeatReuqest : false , // 阻止重复请求
      is_show : true,
      total : 1 ,
    }
  },
  filters : { twoPoint , small } ,
  components : { vHead , LoadMore , vLabel },
  mixins : [ loadMore ] ,
  mounted (){
    this.init();
  },

  methods : {
    init(){
      let param = this.params ;
      getMycare( param ).then( res => {
        this.total = res.total ;
        this.careList = res.result;
        this.is_show = false ;
        this.showLoading = false ;
      }).catch( err => {
        this.is_show = false ;
        this.showLoading = false ;});
    },
    cancle( id ){
      this.$vux.confirm.show({
        title : '提示',
        content : '确定取消关注吗？',
        onCancel(){

        },
        onConfirm(){
          cancleCare( id ).then( res => {
            window.location.reload();
          })
        }
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
      this.params.page ++ ;
      let params = this.params ;
      getMycare( params ).then( res => {
        this.careList = [ ...this.careList , ...res.result ];
        // 加载完成
        this.is_show = false ;
        this.showLoading = false ;
        if( res.result.length < this.params.pageSize ){
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

<style lang="scss" scoped>
  @import "../../style/mixin";
  .care-item{
    height: 2.4rem;
    padding: 0 0.25rem;
    background-color: #fff;
    .care-box{
      display: flex;
      padding: 0.3rem 0;
      width: 100%;
      @include bb-1px( #ddd );
      .img-box{
        flex: 0 0 1.8rem;
        position: relative;
        >img{
          width: 1.8rem;
          height: 1.8rem;
        }
        .type{
          position: absolute;
          top: 0;
          left: 0.08rem;
          width: 0.32rem;
          max-height: 2rem;
          padding: 0.08rem 0 0.18rem;
          border-radius: 0 0 0.16rem 0.16rem;
          text-align: center;
          font-size: 0.24rem;
          color: #fff;
          background-color: #109ee7
        }
      }
      .text-content{
        flex: 0 0  4.74rem;
        overflow: hidden;
        padding-left:0.2rem;
        .title{
            font-size: 0.28rem;
        }
        .address{
          margin-top: 0.3rem;
          font-size: 0.24rem;
          color: #999;
        }
        .price{
          margin-top: 0.3rem;
          color: $red;
          .price-pre{
              font-size: 0.2rem;
          }
          .price-num{
              font-size: 0.3rem;
          }
        }
      }
      .care{
        flex: 0 0 0.44rem;
        width: 0.44rem;
        height: 0.44rem;
        @include bg-image( '../../images/ic_collection_red' ) ;
      }
    }
  }
    .null-data{
      margin-top: 0.5rem;
      font-size: 0.28rem;
      color: #999;
      text-align: center;
    }
</style>
