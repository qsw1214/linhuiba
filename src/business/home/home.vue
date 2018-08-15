<template>
  <div class="home-wraper" ref="scroll">
    <div class="download" ref="download">
      <div class="down-logo">
      </div>
      <div>
        <p>更多完整实用功能</p>
        <p>尽在邻汇吧客户端</p>
      </div>
      <div class="download-btn">
        <a href="http://hz.linhuiba.com/app/business_download_app.html">
          下载APP
        </a>
      </div>
    </div>
    <header class="" ref="head">
      <div class="drop">
        <div class="city">
          <router-link to="/home/city" class="city-link"><span class="cityct">{{ cityName.split('市')[0] }}</span><span class="caret"></span></router-link>
        </div>
      </div>

      <div class="search vt">
        <router-link to="/search">
          <span class="searchIcon"></span>
          <div class="link-search">搜索小区/商圈/园区等关键词</div>
        </router-link>
      </div>
    </header>
    <section ref="swiper" class="swiper">
      <swiper loop auto :interval=4000 dots-position="center" dots-class="custom-bottom" class="banners" :aspect-ratio="375/750" >
        <swiper-item v-for="( item , index ) in bannerimgs" :key="index">
          <li @click.stop="bannerClick( item.link )" :data-href="item.link">
            <img :src="item.pic_url ? item.pic_url : 'https://comment.linhuiba.com/Fia3BCjHyan2ZrniNODOaIV4XtZ3' " :alt="item.title" >
          </li>
        </swiper-item>
      </swiper>
    </section>
    <section class="tags" v-once>
      <flexbox :gutter="0" wrap="wrap">
         <flexbox-item :span="4">
           <router-link to="/fields">
             <div class="fld margin"></div>
             <p class="ct">场地</p>
           </router-link>
         </flexbox-item>
          <!--<flexbox-item :span="3">-->
              <!--<div class="tag ct">-->
                  <!--<router-link to="/map">-->
                      <!--<div class="map margin"></div>-->
                      <!--<p>看图找地</p>-->
                  <!--</router-link>-->
              <!--</div>-->
          <!--</flexbox-item>-->

          <flexbox-item :span="4">
            <router-link to="/mall">
              <div class="mall margin">
                <div class="label">极速</div>
              </div>
              <p class="ct">快速订</p>
            </router-link>
          </flexbox-item>

          <flexbox-item :span="4">
            <router-link to="/group">
              <div class="group margin"></div>
              <p class="ct">拼团</p>
            </router-link>
          </flexbox-item>

      </flexbox>
    </section>
    <!--<section class="special" v-if="fieldTypes.length">-->
      <!--<div class="field">-->
        <!--<span class="field-icon common-icon"></span><span class="common-title">场地类型</span>-->
        <!--<router-link to="/fieldtypeList" class="more"><span class="txt">查看更多</span><i class="icon"></i></router-link>-->
      <!--</div>-->
      <!--<div class="wrapBox">-->
        <!--<div class="classifycontent" :style="{ width : fieldTypes.length * 3.34 + 'rem'  }">-->
          <!--<div class="field-item" v-for="( item , index ) in fieldTypes" :key="index">-->
            <!--<div class="field-type" @click.stop="goFields(item.field_type)">-->
              <!--<img v-lazy="item.home_map_pic_url" :alt="item.name" class="field-img">-->
            <!--</div>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</section>-->
    <div class="today-top">
      <span class="linhui-top"></span>
      <marquee>
        <marquee-item v-for="item in headNews" :key="item.id" class="align-middle">
          <router-link :to="{path: `/article/${item.id}`}"><p class="today-title">{{item.name}}</p></router-link>
        </marquee-item>
      </marquee>
    </div>
    <split-content v-if="hotFields.length"></split-content>
    <section class="all-destine" v-if="hotFields.length">
      <div class="tit">
        <div class="area-desc">大家都在订</div>
        <router-link class="view-more" :to="{ path : '/fields' , query : { hot : 1 } }">
          <span>查看全部</span><span class="right-icon"></span>
        </router-link>
      </div>
      <div class="cont">
        <router-link class="item" :to="{ name : 'fieldsDetail' , params : { id : item.resource_id } , query : { res_type_id : item.res_type_id } }" v-for="(item , index) in hotFields" :key="index">
          <div class="img-box">
            <img v-lazy="item.pic_url" :data-srcset="item.pic_url | half" alt=" ">
            <div class="label-icon" v-if="item.res_type_id==3"></div>
            <!--活动  限时-->
            <div class="hot-icon" v-else-if="item.is_hot"></div>
            <!--场地  热卖-->
            <div class="time" v-if="item.res_type_id==3"><span>时间：</span><span>{{ item.activity_start_date | timeFormat}}-{{ item.deadline |timeFormat}}</span></div>
          </div>
          <div class="info info-spe">
            <div class="name ellipsis">{{ item.resource_name }}</div>

            <!--<div class="subduction-box" v-if="item.subsidy_fee">-->
              <!--<span class="subduction">立减{{ item.subsidy_fee/100 }}元</span>-->
            <!--</div>-->
            <div class="price">
              <span class="price-pre">¥</span><span class="price-num">{{ (item.price - item.subsidy_fee)/100 }}</span>
              <span>/</span>
              <span>{{ item.unit }}</span><span>起</span>
            </div>
          </div>
        </router-link>
      </div>
    </section>
    <split-content v-if="specialFields.length"></split-content>
    <section class="all-destine" v-if="specialFields.length">
      <div class="tit">
        <div class="area-desc">下单我补贴</div>
        <router-link :to="{ path : '/fields' , query : { subsidy : 1 } }" class="view-more">
          <span>查看全部</span><span class="right-icon"></span>
        </router-link>
      </div>
      <div class="cont">
        <router-link class="item" :to="{ name : 'fieldsDetail' , params : { id : item.resource_id } , query : { res_type_id : item.res_type_id } }" v-for="(item , index) in specialFields" :key="index">
          <div class="img-box">
            <img v-lazy="item.pic_url" :data-srcset="item.pic_url | half" alt=" ">
            <div class="label-icon" v-if="item.res_type_id==3"></div>
            <!--活动  限时-->
            <div class="hot-icon" v-else-if="item.is_hot"></div>
            <!--场地  热卖-->
            <div class="time" v-if="item.res_type_id==3"><span>时间：</span><span>{{ item.activity_start_date | timeFormat}}-{{ item.deadline |timeFormat}}</span></div>
          </div>
          <div class="info">
            <div class="name ellipsis">{{ item.resource_name }}</div>

            <div class="subduction-box" v-if="item.subsidy_str">
              <span class="subduction">{{ item.subsidy_str }}</span>
            </div>
            <div class="price">
              <span class="price-pre">¥</span><span class="price-num">{{ (item.price - item.subsidy_fee)/100 }}</span>
              <span>/</span>
              <span>{{ item.unit }}</span><span>起</span>
            </div>
          </div>
        </router-link>
      </div>
    </section>
    <split-content></split-content>
    <!--<section class="coord">-->
        <!--<flexbox :gutter="0" wrap="wrap">-->
            <!--<flexbox-item :span="1/2" class="prt">-->
                <!--<router-link :to="{ path : 'fields' , query : { subsidy : 1 } }" class="day-specail">-->
                <!--</router-link>-->
            <!--</flexbox-item>-->
            <!--<flexbox-item :span="1/2" class="plt">-->
                <!--<router-link :to="{ path : 'fields' , query : { order_by : 'created_at' , order : 'desc' } }" class="new-field">-->
                <!--</router-link>-->
            <!--</flexbox-item>-->
            <!--<flexbox-item :span="1/2" class="prt">-->
                <!--<router-link to="/facilitatorlist" class="good-service">-->
                <!--</router-link>-->
            <!--</flexbox-item>-->
            <!--<flexbox-item :span="1/2" class="plt">-->
                <!--<router-link to="/thematic" class="feature-show">-->
                <!--</router-link>-->
            <!--</flexbox-item>-->
        <!--</flexbox>-->
      <!--</section>-->
    <!--<split-content></split-content>-->
    <!--<section class="themes" v-if="themes.length">-->
        <!--<div class="title border-1px">-->
            <!--<span class="themes-icon common-icon"></span><span class="common-title">精选专题</span>-->
            <!--<router-link to="/themes" class="more"><span class="txt">查看更多</span><i class="icon"></i></router-link>-->
        <!--</div>-->
        <!--<div class="themes-content">-->
           <!--<div class="item border-1px item-1">-->
             <!--<router-link to="/" class="item-link">-->
                 <!---->
             <!--</router-link>-->
           <!--</div>-->
            <!--<div class="item border-1px item-2">-->
                <!--<router-link to="/" class="item-link">-->
                <!--</router-link>-->
            <!--</div>-->
            <!--<div class="item border-1px item-3">-->
                <!--<router-link to="/" class="item-link">-->
                <!--</router-link>-->
            <!--</div>-->
            <!--<div class="themes-item border-1px" v-for="( item , index ) in themes" :key="index">-->
              <!--<router-link :to="{ name: 'themesDetail' , params : { id : item.id } }">-->
                <!--<img :src="item.pic_url ? item.pic_url : 'https://comment.linhuiba.com/Fia3BCjHyan2ZrniNODOaIV4XtZ3'" :alt="item.name">-->
              <!--</router-link>-->
            <!--</div>-->
        <!--</div>-->
      <!--</section>-->
    <!--<split-content></split-content>-->
    <section class="case">
      <div class="tit">
        <div class="area-desc">优质服务商</div>
        <router-link :to="{ path : '/facilitatorlist' , query : { subsidy : 1 } }" class="view-more">
          <span>查看全部</span><span class="right-icon"></span>
        </router-link>
      </div>
      <div class="cont np swiper-container">
        <div class="swiper-wrapper">
          <div v-for="(item, index) in serviceProvider" :key="index" class="item swiper-slide">
          <!-- <router-link :to="{ name : 'facilitatorDetail' , params : { id : item.id } }" > -->
              <router-link :to="{ name : 'facilitatorDetail' , params : { id : item.id } }" >
                <div class="img-box">
                  <img :src="item.pic_url" :alt="item.name" class="img">
                </div>
              </router-link>
              <div class="info">
                <div class="facilitator-des">
                  <span v-if="item.design_and_build">设计搭建</span>
                  <span v-if="item.part_time_service">兼职服务</span>
                  <span v-if="(item.design_and_build && item.part_time_service ? false: false) && item.material_transportation">物料运输</span>
                  <span v-if="(item.design_and_build && item.part_time_service ? false: false) && item.push_execution">地推执行</span>
                </div>
                <div class="small-tit ellipsis">{{ item.company }}</div>
                <!-- <div class="desc ellipsis">{{ item.digest }}</div> -->
                <div class="facilitator-details">
                  <span class="facilitator-position" :class="{mg02: item.office_location.length <= 2}"><span></span>{{ item.office_location }}</span>
                  <a :href="userInfo ? 'tel:'+ item.mobile : 'javascript:void(0);'" class="facilitator-tell"><span></span>{{ userInfo ? item.mobile : '登录后查看号码'}}</a>
                </div>
                <!-- <div class="btn">查看详情</div> -->
              </div>
            <!-- </router-link> -->
          </div>
        </div>
      </div>
    </section>

    <split-content></split-content>
    <section class="case mb56">

      <div class="tit">
        <div class="area-desc">经典案例</div>
        <router-link :to="{ path : '/fields' , query : { subsidy : 1 } }" class="view-more">
          <!-- <span>查看全部</span><span class="right-icon"></span> -->
        </router-link>
      </div>
      <div class="cont np swiper-container1">
        <div class="swiper-wrapper">
        <div v-for="( item , index ) in cases" :key="index" class="item swiper-slide">
          <a :href="item.origin" v-if="item.origin">
            <div class="img-box">
              <img :src="item.pic_url" :alt="item.name" alt=" " class="img ">
            </div>
            <div class="info">
              <div class="small-tit ellipsis">{{ item.name }}</div>
              <div class="desc ellipsis">{{ item.digest }}</div>
              <!-- <div class="btn">查看详情</div> -->
            </div>
          </a>
          <router-link :to="{ name : 'article' , params : { id : item.id } , query : { page : 'case' } }" v-else>
            <div class="img-box">
              <img :src="item.pic_url" :alt="item.name" class="img">
            </div>
            <div class="info">
              <div class="small-tit ellipsis">{{ item.name }}</div>
              <div class="desc ellipsis">{{ item.digest }}</div>
              <!-- <div class="btn">查看详情</div> -->
            </div>
          </router-link>
          </div>
        </div>
      </div>
    </section>



    <v-footer :oneselected="true"></v-footer>
    <go-top></go-top>
  </div>
</template>

<script>

import { test ,getCurrentCity , getCitys , getBanners ,getThemes , getResources ,getCase , getCategory , getWorkerInfo, getHeadlineNews, getFacilitatorList } from 'src/service/getData'
import splitContent from 'src/components/splitContent'
import vFooter from 'src/components/vFooter'
import goTop from 'src/components/goTop'
import { Swiper , SwiperItem , Flexbox , FlexboxItem,  Marquee, MarqueeItem  } from 'vux'
import { small , half , timeFormat ,twoPoint } from 'src/filters'
import { mapState , mapMutations , mapActions } from 'vuex'
import { getSession, setSession } from 'src/config/tools'
import { getStorage , setStorage , getStyle } from 'src/config/tools'
import { initDataConfig } from 'src/config/data'
import Swipers from 'swiper';
import 'swiper/dist/css/swiper.min.css';
export default {
  data () {
    return {
      userInfo :  getSession("userInfo"),
      currentCityId : '',  // 当前城市
      cityName : '杭州' ,
      bannerimgs : [], // 轮播图
      specialFields : [] , // 特卖场地
      cases : [] , // 合作案例
      themes : [] , // 专题列表
      fieldTypes : [] ,// 场地类型
      hotFields : [] , // 大家都在订  热门场地
      headNews: [],
      serviceProvider: [] // 服务商
    }
  },
  components : {
    Swiper,
    SwiperItem,
    Flexbox,
    FlexboxItem,
    splitContent,
    vFooter,
    goTop,
    Marquee,
    MarqueeItem
  },
  filters : {
    small,
    half,
    twoPoint,
	  timeFormat
  },
  beforeRouteLeave(to , from , next){
    to.meta.keepAlive = false ;
    next()
  },
  async created () {
    this.$store.dispatch('refreshConfig') ;
    // 去掉场地和活动列表的筛选条件
    this.$store.state.filterData = {} ;
    // 用户当前城市
    let cityId = getStorage( 'cityId' )  ;
    if(cityId == 0 ||cityId){
      this.currentCityId = cityId ;
      getCitys().then(res => {
        this.ALL_CITYS(res.result.cities);
        for (let item of res.result.cities) {
          if (item.id == cityId) {
            this.cityName = item.name;
            this.currentCityId = item.id;
            this.RECORD_CITY(cityId);
            this.RECORD_CITYNAME(item.name);
            return false;
          }
        }
      })
    }else {
      let city = await getCurrentCity() ;
      let cityName = city.result.city || '杭州市';
      let cityId = city.result.city_id || 90 ;
      // 定位到当前位置城市
      this.cityName = cityName;
      this.currentCityId = cityId ;
      this.RECORD_CITY(cityId);
      this.RECORD_CITYNAME(cityName);
    }
  },
  async mounted () {
    console.log(this.userInfo)
    this.init();
    await getCase().then( res => {
      this.cases = res.result ;
    }).catch(err => { console.log(err) });
    getHeadlineNews().then(res => {
      this.headNews = res.result
    }).catch(e => {
      this.$vux.toast.text(e.msg, 'middle')
    })
    let params = {
      page : 1,
      pageSize : 6
    }
    await getFacilitatorList(params).then(res => {
      this.serviceProvider = res.result.data
      // if (this.serviceProvider.length > 2) {
      //   this.serviceProvider = this.serviceProvider.splice(0, 2)
      // }
    }).catch(e => {
      this.$vux.toast.text(e.msg, 'middle')
    })
    //let p = { city_id : +this.currentCityId, page : 1 };
//    getThemes( p ).then( res => {
//      this.themes = res.result ;
//    }).catch(err => {  });
//	  getCategory().then( res => {
//	    this.fieldTypes = res.result;
//
//    }).catch(err => {  });
	// 操作顶部导航栏的背景色
    window.addEventListener( 'touchmove' , this.scroll , false );
    window.addEventListener( 'scroll' , this.scroll , false );

  var mySwiper = new Swipers ('.swiper-container', {
    slidesPerView : 2.05,
    spaceBetween : 10,
  })   
  var mySwiper = new Swipers ('.swiper-container1', {
    slidesPerView : 1.45,
    spaceBetween : 10,
    // slidesOffsetBefore : -50,
    freeMode : true,
freeModeMomentum : false,
  })       

  },
  methods : {
    ...mapActions(['refreshConfig']),
    ...mapMutations([
      'RECORD_CITYNAME',
      'RECORD_CITY',
      'ALL_CITYS'
    ]),
    goFields(arr){
      let ids = [];
      if(arr.length){
        for(let item of arr){
          ids.push( item.id )
        }
      }
      this.$router.push({path : '/fields' , query : { field_type_id : ids } });
    },
    init(){
      let city_id = this.currentCityId ;
      getBanners( city_id )
        .then( res => {
          this.bannerimgs = res.result ;
        }).catch(err => {});
      let params = {
        city_id: this.currentCityId,
        resource_type: 1, // 活动资源
        order_by: 'number_of_order',
        order: 'desc' ,
        page: 1,
        pageSize: 4,
        is_home_page: 1,
        hot : 1
      };
      getResources(initDataConfig(params))
        .then(res => {
          this.hotFields = res.result;
        }).catch(err => {
      });

      // 获取补贴场地
      let specialParams = {
        city_id : this.currentCityId,
        resource_type : 1,
        order_by : 'number_of_order',
        order: 'desc' ,
        page : 1 ,
        pageSize : 4 ,
        is_home_page: 1,
        subsidy : 1
      };
      getResources( initDataConfig( specialParams ) )
        .then( res => {
          this.specialFields = res.result ;
        }).catch(err => {});

    },
    bannerClick(bannerLink){
      function getUrlObj(url) {
        let obj = {};
        if (url.indexOf('?') != -1) {
          url = url.substr(1);
          let arr = url.split("&");
          for (let i = 0; i < arr.length; i++) {
            obj[arr[i].split("=")[0]] = decodeURIComponent( arr[i].split("=")[1] )
          }
        }
        return obj;
      }
      if (bannerLink.indexOf('/company/view/') != -1) {
        //去往文章页面
        let id = bannerLink.split(`/company/view/`)[1];
        this.$router.push({ name : 'article' , params : { id : id } });
        return false ;
      } else if (bannerLink.indexOf('/fields/index') != -1 || bannerLink.indexOf('/activities/index') != -1) {
        //去往列表
        let search =  bannerLink.split('?')[1];
        if(search){
          let url = window.location.origin + '/#/fields?is_app=1&' + search ;
          window.location.href = url ;
          return false ;
        }else{
          let url = window.location.origin + '/#/fields' ;
          window.location.href = url ;
          return false ;
        }

      }else if ( bannerLink.indexOf('/fields/view') != -1 ) {
        // 场地详情
        let id = bannerLink.split('/fields/view/')[1];
        let url = window.location.origin + '/#/fields/fieldsDetail/' + id + '?res_type_id=1' ;
        window.location.href = url ;
        return false ;
      }else if ( bannerLink.indexOf('/activities/view') != -1 ) {
        // 活动详情
        let id  = bannerLink.split('/activities/view/')[1];
        let url = window.location.origin + '/#/fields/fieldsDetail/' + id + '?res_type_id=3';
        window.location.href = url ;
        return false ;
      }else if( bannerLink.indexOf('/groups/index') != -1 ){
        this.$router.push('/group');
        return false ;
      }else if( bannerLink.indexOf('/service/index') != -1 ){
        this.$router.push('/facilitatorlist');
        return false ;
      }else if( bannerLink.indexOf('weixin') != -1 ){
        window.location.href = bannerLink ;
        return false ;
      }else{
        let link = bannerLink.replace( /v31m/gi , 'm');
        window.location.href = link ;
        return false ;
      }
    } ,
    scroll(){
      let top = document.body.scrollTop || document.documentElement.scrollTop || window.scrollY;
      let head = this.$refs.head ;
      let download = this.$refs.download ;
      let dh = getStyle( download , 'height');
      if( top > dh ){
        head.className = 'scroll' ;
      }else{
        head.className = '' ;
      }
//      let swiper = this.$refs.swiper ;
//      let h = getStyle( swiper , 'height' ) - getStyle( head , 'height' );
//      let n = top / h ;
//      try{
//        head.style.background = `rgba( 0,133,227 , ${ n*1 })`;
//      }catch(err){}
//      if( top <= 10 ){
//        try{
//          head.style.background = `rgba( 0,133,227,0)`;
//        }catch(err){}
//      }
    }
  },
  destroyed(){
    // 注销掉绑定在全局对象window上的事件监听
    window.removeEventListener('scroll' , this.scroll );
    window.removeEventListener('touchmove' , this.scroll );
  }
}

</script>

<style lang="scss" scoped>
  @import '../../style/mixin' ;

  .home-wraper {
    padding-bottom: 1rem;
    background-color: $bgc;
  }
  header {
    position: absolute;
    top:  1.2rem ;
    left: 0;
    z-index: 2;
    padding: 0.1rem 0.24rem;
    line-height: 0.64rem;
    display: flex;
    width: 100%;
    justify-content: space-between;
    .drop {
      font-size: 0.3rem;
      .city-link {
        display: block;
        .cityct {
          color: $white;
        }
        .caret {
          display: inline-block;
          vertical-align: middle;
          margin: 0 0.1rem;
          @include wh( 0.26rem , 0.12rem );
          @include bg-image( "../../images/ic_drop-down_white_normal_three" );
        }
      }
    }
    .search {
      position: relative;
      @include wh( 5.55rem , 0.64rem );
      .searchIcon {
        position: absolute;
        left: 0.2rem;
        top: 0.14rem;
        @include wh( 0.36rem , 0.34rem );
        @include bg-image( "../../images/ic_search_gray_normal_three" );
      }
      .link-search {
        background-color: rgba( 255,255,255,1 );
        @include wh( 100% , 100% );
        line-height: 0.64rem;
        padding-left: 0.71rem;
        border-radius: 0.32rem;
        font-size: 0.28rem;
        color: #b4b4b4;
        background-color: #fff;
      }
    }
    &.scroll{
      position: fixed;
      top:0 ;
      left: 0;
      background-color: $mainColor;
    }
  }
  .swiper {
    width: 100%;
    height: 3.75rem;
    overflow: hidden;
    .banners {
      img {
        width: 100%;
        height: 3.75rem;
      }
    }
  }
  /*
  header {
    position: fixed;
    top:  0 ;
    left: 0;
    z-index: 1;
    padding: 0.1rem 0.24rem;
    height: 0.88rem;
    line-height: 0.68rem;
    display: flex;
    width: 100%;
    justify-content: space-between;
    background-color: $mainColor;
    .drop {
      font-size: 0.3rem;
      .city-link {
        display: block;
        .cityct {
            color: $white;
        }
        .caret {
            display: inline-block;
            vertical-align: middle;
            margin: 0 0.1rem;
            @include wh( 0.14rem , 0.12rem );
            @include bg-image( "../../images/ic_zhankai" );
        }
      }
    }
    .search {
      position: relative;
      @include wh( 5.88rem , 0.64rem );
      .searchIcon {
        position: absolute;
        left: 0.2rem;
        top: 0.14rem;
        @include wh( 0.36rem , 0.34rem );
        @include bg-image( "../../images/ic_search_gray_normal_three" );
      }
      .link-search {
          background-color: rgba( 255,255,255,1 );
        @include wh( 100% , 100% );
        line-height: 0.64rem;
        padding-left: 0.71rem;
        border-radius: 0.32rem;
        font-size: 0.28rem;
        color: #b4b4b4;
        background-color: #fff;
      }
    }
  }
  .swiper {
    padding-top: 0.88rem;
    width: 100%;
    height: 4.63rem;
    overflow: hidden;
    .banners {
      img {
        width: 100%;
        height: 3.75rem;
      }
    }
  }
  */
  .tags {
    padding:0.4rem 0;
    background-color: #fff;
    font-size: 0.24rem;
    a{
      display: block;
      color: #666;
    }
    p {
      margin-top: 0.06rem;
    }
    .fld{
      @include wh( 1.18rem , 1.18rem );
      @include bg-image( '../../images/ic_zhaochangdi' );
    }
    .mall{
      position: relative;
      @include wh( 1.18rem , 1.18rem );
      @include bg-image( '../../images/ic_dangtianding' );
      .label{
        position: absolute;
        top: 0;
        right: -0.24rem;
        height: 0.3rem;
        line-height: 0.3rem;
        padding: 0 0.1rem;
        border-radius: 0.15rem;
        @include sc(0.22rem,#fff);
        background-color: #FF2F1A;
      }
    }
    .group{
      @include wh( 1.18rem , 1.18rem );
      @include bg-image( '../../images/ic_laibaotuan' );
    }
  }
  .all-destine{
    background-color: #fff;
    .tit{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0.24rem 0;
      .area-desc{
        @include sc(0.36rem,$fontColor);
        font-weight: bold;
      }
      .view-more{
        display: flex;
        align-items: center;
        @include sc(0.24rem,#999);
        .right-icon{
          @include wh(0.44rem,0.44rem);
          @include bg-image('../../images/icon_more_gary');
        }
      }
    }
    .cont{
      display: flex;
      flex-wrap: wrap;
      padding: 0 0.24rem 0.4rem;
      .item{
        margin-top: 0.4rem;
        .img-box{
          position: relative;
          @include wh(3.38rem,2.62rem);
          border-radius: 0.04rem;
          overflow: hidden;
          img{
            @include wh(3.38rem,2.62rem);
          }
          .label-icon{
            position: absolute;
            top: 0.08rem;
            right: 0.11rem;
            @include wh(0.8rem,0.42rem);
            @include bg-image('../../images/ic_xianshi');
          }
          .hot-icon{
            position: absolute;
            top: 0.08rem;
            right: 0.11rem;
            @include wh(0.8rem,0.42rem);
            @include bg-image('../../images/ic_remai');
          }
          .time{
            position: absolute;
            bottom: 0;
            left: 0;
            @include wh(100%,0.4rem);
            line-height: 0.4rem;
            padding-left: 0.2rem;
            @include sc(0.22rem,#fff);
            background-image: linear-gradient(-90deg, #FF6B1F 0%, #FF3A27 100%);
          }
        }
        .info-spe{
          overflow: hidden;
        }
        .info{
          max-width: 3.38rem;
          .name{
            margin-top: 0.2rem;
            @include sc(0.3rem,$fontColor);
          }
          .subduction-box{
            margin-top: 0.2rem;
            .subduction{
              display: inline-block;
              padding: 0 0.1rem;
              height: 0.36rem;
              line-height: 0.36rem;
              @include sc(0.22rem,$orange);
              background-color: rgba(255,102,0,0.1);
              border-radius: 0.04rem;
            }
          }

          .price{
            margin-top: 0.16rem;
            @include sc(0.22rem,$red);
            .price-num{
              font-size: 0.28rem;
            }
          }
        }

        &:nth-child(2n){
          margin-left: 0.2rem;
        }
      }
    }
  }
  .case{
    background-color: #fff;
    .tit{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0.24rem 0;
      .area-desc{
        @include sc(0.36rem,$fontColor);
        font-weight: bold;
      }
      .view-more{
        display: flex;
        align-items: center;
        @include sc(0.24rem,#999);
        .right-icon{
          @include wh(0.44rem,0.44rem);
          @include bg-image('../../images/icon_more_gary');
        }
      }
    }
    .cont {
      display: flex;
      flex-wrap: wrap;
      padding: 0 0.24rem 0.4rem;
      overflow: hidden;
      .item {
        width: 3.38rem;
        // margin-top: 0.4rem;
        // border-radius: 0.04rem;
        // box-shadow: -0.06rem 0.06rem 0.2rem #f0f0f0;
        >a{
          display: block;
        }
        .img{
          @include wh(100%,2.56rem);
          // margin: 0.2rem auto 0;
        }
        .info{
          // text-align: center;
          .small-tit{
            margin-top: 0.2rem;
            // padding: 0 0.2rem;
            font-weight: bold;
            text-align: left;
            @include sc(0.3rem,#3A4042);
          }
          .desc{
            height: 0.28rem;
            margin-top: 0.16rem;
            // padding: 0 0.2rem;
            @include sc(0.24rem,#999);
            text-align: left;
          }
          .btn{
            display: inline-block;
            padding: 0 0.16rem;
            height: 0.4rem;
            line-height: 0.4rem;
            margin: 0.54rem 0;
            @include sc(0.22rem,#999);
            border: 1px solid rgba(151,151,151,0.5);
            border-radius: 0.2rem;
          }
          .facilitator-des {
            margin-top: .16rem;
            font-size: .24rem;
            position: absolute;
            top: 2.1rem;
            left: .12rem;
            > span {
              background: rgba(0,0,0,0.60);
              border-radius: 2px;
              padding: .06rem .2rem;
              color: #fff;
              text-align: justify;
              margin-right: .16rem;
            }
          }
          .facilitator-details {
            margin-top: .26rem;
            font-size: .24rem;
            .facilitator-position {
              color: #999999;
              // margin-right: 0.2rem;
              > span {
                display: inline-block;
                @include wh(0.2rem,0.26rem);
                @include bg-image('../../images/ic_map_home');
                position: relative;
                top: .03rem;
                margin-right: .06rem;
              }
            }
            .facilitator-tell {
              color: #999999;
              font-size: .24rem;
              > span {
                 display: inline-block;
                @include wh(0.2rem,0.26rem);
                @include bg-image('../../images/ic_iphone');
                position: relative;
                top: .03rem;
                margin-right: .06rem;
              }
            }
          }
        }
        &:nth-child(2n){
          // margin-left: 0.2rem;
        }
      }
    }
  }
  .mg02 {
    margin-right: 0.2rem;
  }
  .mb56 {
    margin-bottom: .56rem;
  }
  /*.coord {
    background-color: #fff;
    padding: 0.3rem 0;
    .com{
      display: block;
      height: 2.38rem;
    }
    .prt{
      padding-right: 0.02rem;
    }
    .plt{
        padding-left: 0.02rem;
    }
    .day-specail{
      @extend .com ;
        margin-bottom: 0.04rem;
      @include bg-image('../../images/ic_sale_normal_three');
    }
    .new-field{
        @extend .com ;
        margin-bottom: 0.04rem;
        @include bg-image('../../images/ic_new_normal_three');
    }
    .good-service{
        @extend .com ;
        @include bg-image('../../images/ic_feature_normal_three');
    }
    .feature-show{
        @extend .com ;
        @include bg-image('../../images/ic_theme_normal_three');
    }
  }
  .themes{
    background-color: #fff;
    .title{
      padding: 0.3rem 0;
      text-align: center;
      position: relative;
      @include bb-1px(#e5e5e5);
      .themes-icon{
        @include bg-image( '../../images/ic_special_normal_three' )
      }
      .more{
        position: absolute;
        top: 0.3rem;
        right: 0.1rem;
        @include sc(0.24rem,#999);
        display: flex;
        align-items: center;
        .icon{
          @include wh(0.44rem,0.44rem);
          @include bg-image('../../images/icon_more_gary');
        }
      }
    }
    .themes-content{
      //.item{
      //  @include wh( 100% , 3.25rem );
      //  @include bb-1px(#e5e5e5);
      //  .item-link{
      //      display: block;
      //      @include wh( 100% , 3.25rem );
      //  }
      //  &.item-1{
      //    @include bg-image('../../images/ic_theme_one_noamal_three');
      //  }
      //  &.item-2{
      //      @include bg-image('../../images/ic_theme_two_noamal_three');
      //  }
      //  &.item-3{
      //      @include bg-image('../../images/ic_theme_three_noamal_three');
      //  }
      //}
        padding-bottom: 0.3rem;
       .themes-item{
         padding: 0.1rem 0.24rem;
         @include bb-1px(#e5e5e5);
         a{
           display: block;
           img{
             @include wh( 7.02rem , 3.9rem );
           }
         }
         &:last-child{
           padding: 0.1rem 0.24rem 0;
           @include bd-none;
         }
       }
    }
  }*/

  .download{
    display: flex;
    align-items: center;
    @include wh( 100% , 1.2rem );
    padding: 0 0.24rem;
    font-size: 0.28rem;
    color: #666;
    background-color: #fff;
    .down-logo{
      @include wh( 1.2rem , 1.2rem );
      @include bg-image('../../images/ic_downlode_applogo_three');
    }
    .download-btn{
      @include wh( 2.08rem , 0.72rem );
      margin-left: 1.25rem;
      line-height: 0.72rem;
      background-color: $mainColor;
      border-radius: 0.08rem;
      >a{
        display: block;
        color: #fff;
        text-align: center;
      }
    }
    p {
      line-height: 0.4rem;
    }

  }
  .today-top {
    background-color: #fff;
    padding: .24rem .28rem;
    .linhui-top {
      @include bg-image('../../images/ic_linhuidongtai_three_three');
      display: block;
      height: .36rem;
      width: 1.4rem;
      margin-right: .4rem;
    }
  }
  .vux-marquee {
    width: 76% !important;
    float: right !important;
    position: relative !important;
    top: -17px !important;
    padding-left: 10px;
    border-left: 1px solid #dcdcdc;
  }
  .today-title {
    width:100%; white-space:nowrap; text-overflow:ellipsis; -o-text-overflow:ellipsis; overflow:hidden;
  }
  .img-box{
    margin: 0.2rem auto 0;
    border-radius: 4px;
    overflow: hidden;
  }
</style>
