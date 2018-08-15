<template>
  <div class="themes-wraper">
    <v-scrollhead go-back="true" isFixed="true">
      <div slot="center-part">专题推荐</div>
    </v-scrollhead>
    <section class="themes-top" >
      <div class="theme-item">
        <div class="theme-img">
          <img :src="themeDetail.pic_url" alt=" ">
          <!--<div class="name-wrap">-->
            <!--<p class="theme-name">{{themeDetail.name}}</p>-->
          <!--</div>-->
        </div>
        <div class="theme-desc">{{themeDetail.description}}</div>
      </div>
    </section>
    <section class="field-list">
        <flexbox :gutter="0" wrap="wrap" justify="space-between"   v-load-more="loadingMore" v-if="fields.length" type="1">
          <flexbox-item :span="34/70"  v-for="(item ,index ) in fields":key="index">
            <router-link :to="{ name : 'fieldsDetail', params : { id : item.resource_id } }" class="flex-demo">
            <card>
                <img class="field-img" slot="header" v-lazy="item.pic_url" :data-srcset="item.pic_url | half">
                <div orient="vertical" slot="content" class="cart-txt">
                  <p class="field-name ellipsis">{{item.resource_name}}</p>
                  <div class="field-bottom clear">
                    <div  class="field-price left"><span>￥</span>{{item.price/100}}</div>
                    <div  class="field-num right">人流量：{{item.number_of_people}}</div>
                  </div>
                </div>
            </card>
          </router-link>
          </flexbox-item>
        </flexbox>
        <load-more v-show="is_show" :tip="loadingTip" :show-loading="showLoading" ></load-more>

  </section>

  <app-down v-show="url_str&&appdownShow" :params="{ url_str:url_str,pic_url:pic_url,name:name,description:description}" link="https://aj4j3o.mlinks.cc/Ad7r"></app-down>
  </div>

</template>

<script>
import vScrollhead from 'src/components/vScroolhead.vue'
import {  LoadMore ,Flexbox,FlexboxItem,Card } from 'vux'
import AppDown from 'src/components/AppDown.vue';
import { loadMore } from 'src/components/mixin'
import { getThemeDetail,getResources } from 'src/service/getData'
import { initDataConfig } from 'src/config/data'
import { small , half } from 'src/filters'
import { wxshare } from 'src/config/wechatShare';

export default {
  data () {
    return {
      data:{},
      themeDetail : {},
      id: this.$route.params.id,
      fields:[],
      showLoading : false,
      loadingTip : '正在加载...',
      end : false , // 到底了
      preventRepeatReuqest : false  , // 阻止重复请求
      is_show : false ,
      url_str : '',
      description : '',
      name : '' ,
      pic_url : '',
      appdownShow : false ,
    }
  },
  components : {
    LoadMore , Flexbox , FlexboxItem , Card , vScrollhead , AppDown
  },
  mixins : [ loadMore ] ,
  filters : {
    small,
    half
  },
  async beforeMount(){
   //  专题列表id
		let id = this.id ;
    this.$vux.loading.show({
            text: 'loading...'
          });
    let res = await getThemeDetail(id) ;
    this.themeDetail = res.result;
    this.url_str = res.result.link ;
    this.name = res.result.name ;
    this.description = res.result.description ;
    this.pic_url = res.result.pic_url ;
    this.data = initDataConfig(res.result);
    this.initData();
    wxshare({
      title : '邻汇吧专题推荐' ,
      desc : '精心挑选、各具特色的高品质场地，让找场地更高效' ,
      imgUrl : res.result.pic_url,
      link : window.location.origin + '?from=singlemessage'+ window.location.hash
    })
  },
  mounted () {

  },
  updated(){


  },
  methods : {
    initData(){
      this.data.page=1;
		  getResources(this.data)
        .then((res)=>{
          this.fields = res.result;
          this.$vux.loading.hide();
          this.appdownShow = true ;
        }).catch(err => { this.$vux.loading.hide(); })
    },
    loadingMore(){
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

      this.data.page ++ ;

      getResources( this.data )
        .then( res => {
          this.fields = [ ...this.fields , ...res.result ];
          // 加载完成
          this.is_show = false ;
          this.showLoading = false ;

          if( res.result.length < this.data.pageSize ){
              this.end = true ;
              this.is_show = true ;
              this.loadingTip = '没有更多数据了';
          }
          this.preventRepeatReuqest = false;
        })
    }
  },
  activated () {
  }
}

</script>

<style lang="scss" scoped>
@import '../../style/mixin' ;
body{
  background:#e8e8e8;
  .scroller{
    width:100%;
    height:100%;
    box-sizing:border-box;
  }
}
.themes-wraper{
    overflow: hidden;
}
.themes-top{
  width:100%;
  background: #e8e8e8;
  margin-bottom:.2rem;
  .theme-item{
    background: #fff;
    // margin-bottom: 0.2rem;
    @include wh( 100% , auto );
    .theme-img{
      position: relative;
      @include wh( 100% , 4.2rem) ;
      img{
        @include wh(100%,4.2rem) ;
      }
      .name-wrap{
        @include wh( 100% , 4.2rem );
        position: absolute;
        top:0;
        left:0;
        background: rgba(0,0,0,0.6);
        p.theme-name{
          text-align: center;
          line-height: 1.2rem;
          @include sc(0.52rem, #fff);
          @include center;
          @include wh( 100% , auto );
          &:before{
            content: '';
            position: absolute;
            bottom: 0;
            left:0;
            right:0;
            margin:0 auto;
            background: #fff;
            @include wh( 5.4rem , 0.02rem );
          }
          &:after{
            position: absolute;
            bottom: -0.08rem;
            left:0;
            right:0;
            margin:0 auto;
            background: #fff;
            content: '';
            @include wh( 5.4rem , 0.04rem );
          }
        }
      }
    }
    .theme-desc{
      box-sizing: border-box;
      padding:0.25rem;
      height:auto;
      line-height: 0.40rem;
      @include wh( 100% , auto );
      @include sc(0.26rem, #666);
    }
  }
}
.field-list{
  transition:all 0.5s;
  box-sizing:border-box;
  padding:0.2rem 0.25rem 0.3rem;
  background:#fff;
  .flex-demo{
    display: block;
    .field-img{
      width:100%;
      height:2.7rem;
    }
    .cart-txt{
      height:1.2rem;
      box-sizing:border-box;
      margin-bottom:0.1rem;
      border-top:0 none;
      @include bd-1px(#ddd);
      line-height:100%;
      padding:0 0.1rem;
      .field-name,.field-bottom{
        line-height:0.6rem;
      }
      .field-price{
        @include sc(0.28rem, $red);
        span{
          @include sc(0.22rem, $red);
        }
      }
      .field-num{
        @include sc(0.22rem, #999);
      }

    }
  }


}

</style>
<style lang="scss">
    .weui-loadmore_line{
        border: 0 none!important;
    }
    .weui-panel:after , .weui-panel:before{
        height: 0 !important;
        border-top: 0 none!important;
    }
    .weui-panel:after{
      border-bottom: 0 none !important;
    }
</style>
