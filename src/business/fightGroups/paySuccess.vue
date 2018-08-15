<template lang="html">
  <div>
    <v-head isFixed="true" path="/group">
      <div slot="center-part">支付成功</div>
      <div slot="right-part" class="rt">
        <router-link to="home" class="go-home">返回首页</router-link>
      </div>
    </v-head>
    <div class="main">
      <div class="bg-img"></div>
      <p class="successp-text">支付成功</p>
      <p class="tips">拼团还在持续中，请留意成团通知。</p>
      <div class="btn-group">
        <router-link to="/group?type=2" class="view-group">查看拼团订单</router-link>

        <router-link to="/invite" class="invite-friends">邀请好友</router-link>
      </div>
    </div>
    <section class="group" v-if="list.length">
      <div class="tit">其他火爆拼团</div>
      <div class="rec-list" v-load-more="loadingMore">
        <div class="rec-item" v-for="(item , index) in list" :key="index">
          <router-link :to="{ name: 'groupDetail' , params : {id:item.id} }" class="rec-link">
            <div class="img-box">
               <img v-lazy="
                item.selling_resource.physical_resource.physical_resource_first_img&&item.selling_resource.physical_resource.physical_resource_first_img.pic_url?
                item.selling_resource.physical_resource.physical_resource_first_img.pic_url + '-linhuiba_watermark?v=1' :
                 'https://comment.linhuiba.com/Fia3BCjHyan2ZrniNODOaIV4XtZ3'" alt=" ">
              <div class="position">已有<span>{{ item.number_of_group_purchase_now }}</span>人参团</div>
            </div>
            <div class="rec-info">
              <div class="name ellipsis">{{ item.selling_resource.physical_resource.name }}</div>
              <div class="price-people">
                <div class="price">
                  <span class="price-pre">¥</span><span class="price-num">{{ item.selling_resource.first_selling_resource_price.price/100 | twoPoint }}</span><span class="text">起拼</span>
                </div>
              </div>
            </div>
          </router-link>
        </div>
        <load-more v-show="is_show" :show-loading="showLoading" :tip="loadingTip" background-color="#f0f0f0"></load-more>
      </div>

    </section>
  </div>
</template>

<script>
  import vHead from 'src/components/vHead' ;
  import { getStorage } from 'src/config/tools' ;
  import { getGroupList } from 'src/service/getData' ;
  import { half , twoPoint } from 'src/filters/index';
  import { LoadMore } from 'vux';
  import { loadMore } from 'src/components/mixin';
export default {
  data () {
    return {
      page : 1,
      pageSize : 10,
      city_id : this.$store.state.city_id || getStorage( 'cityId' ) || this.$route.query.city_id  ||90 ,
      list : [],

      showLoading : false,
      loadingTip : '正在加载...',
      end : false , // 到底了
      preventRepeatReuqest : false , // 阻止重复请求
      is_show : false,
    }
  },
  filters : { half ,twoPoint },
  mixins : [ loadMore ] ,
  components : {
    vHead, LoadMore
  },
  mounted(){
    let params = {
      page : this.page ,
      pageSize : this.pageSize,
      city_id : this.city_id
    };
    getGroupList( params ).then( res => {
      this.list = res.result.data ;
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
      let params = {
        page : this.page ,
        pageSize : this.pageSize,
        city_id : this.city_id
      };
      getGroupList( params ).then( res => {
        this.list = [ ...this.list , ...res.result.data ];
        // 加载完成
        this.is_show = false ;
        this.showLoading = false ;
        if( res.result.data.length < this.pageSize ){
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
  @import '../../style/mixin' ;
  .go-home{
    font-size: 0.26rem;
  }
  .main{
    padding-bottom: 0.8rem;
    overflow: hidden;
    background-color: #fff;
    .bg-img{
      @include wh( 1.32rem , 1.32rem );
      margin: 0.54rem auto;
      @include bg-image('../../images/ic_success');
    }
    .successp-text{
      text-align: center;
      font-size: 0.36rem;
    }
    .tips{
      margin-top: 0.2rem;
      font-size: 0.26rem;
      color: #A9A9A9;
      text-align: center;
    }
    .btn-group{
      padding: 0 1.2rem;
      margin-top: 0.6rem;
      display: flex;
      justify-content: space-between;
      .view-group{
        display: inline-block;
        @include wh( 2.36rem , 0.64rem );
        line-height: 0.64rem;
        text-align: center;
        border: 1px solid #999;
        border-radius: 0.08rem  ;
      }
      .invite-friends{
        display: inline-block;
        @include wh( 2.36rem , 0.64rem );
        line-height: 0.64rem;
        text-align: center;
        border-radius: 0.08rem  ;
        color: #fff;
        background-color: $mainColor;
      }
    }
  }
  .group{
    margin-top: 0.2rem;
    .tit{
      padding: 0 0.24rem;
      height: 0.94rem;
      line-height: 0.94rem;
      font-size: 0.34rem;
      background-color: #fff;
    }
    .rec-list{
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 0 0.24rem;
      background-color: #fff;
      .rec-item{
        width: 3.4rem;
        margin-bottom: 0.16rem;
        .rec-link{
          display: block;
          .img-box{
            position: relative;
            top:0;
            left:0;
            >img{
              @include wh( 3.4rem , 2.72rem );
            }
            .position{
              position: absolute;
              bottom: 0.2rem;
              right: 0.2rem;
              font-size: 0.22rem;
              color: #fff;
            }
          }
          .rec-info{
            padding: 0.2rem 0 0.28rem 0;
            background-color: #fff;
            .name{
              font-size: 0.3rem;
            }
            .price-people{
              margin-top: 0.18rem;
              .price{
                .price-pre{
                  display: inline-block;
                  @include wh( 0.22rem , 0.22rem );
                  text-align: center;
                  font-size: 0.24rem;
                  color: $red;
                }
                .price-num{
                  font-size: 0.34rem;
                  color: $red;
                }
                .text{
                  margin-left: 0.04rem;
                  font-size: 0.22rem;
                  color: #999;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
